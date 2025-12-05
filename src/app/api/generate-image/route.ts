import OpenAI from "openai";
import { NextResponse } from "next/server";
import { uploadCoinImage } from "@/utils/storage";
import crypto from "node:crypto";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return errorResponse(
      "Image generation service not configured.",
      "MISSING_API_KEY",
      503
    );
  }

  if (!process.env.PUBLIC_BUCKET_PROXY_URL) {
    return errorResponse(
      "Storage service not configured.",
      "MISSING_STORAGE_CONFIG",
      503
    );
  }

  let prompt: string;
  try {
    const body = await req.json();
    prompt = body?.prompt;
  } catch {
    return errorResponse("Invalid request body.", "INVALID_JSON", 400);
  }

  if (!prompt || typeof prompt !== "string") {
    return errorResponse("Prompt is required.", "MISSING_PROMPT", 400);
  }

  if (prompt.length > 4000) {
    return errorResponse(
      "Prompt is too long. Maximum 4000 characters.",
      "PROMPT_TOO_LONG",
      400
    );
  }

  // generate image
  let b64: string;
  try {
    const dalleRes = await client.images.generate({
      model: "dall-e-3",
      prompt,
      size: "1024x1024",
      response_format: "b64_json",
      n: 1,
    });

    const img = dalleRes.data?.[0];
    b64 = img?.b64_json ?? "";

    if (!b64) {
      return errorResponse(
        "Image generation returned no data.",
        "EMPTY_RESPONSE",
        502
      );
    }
  } catch (err) {
    console.error("OpenAI image generation error:", err);
    return handleOpenAIError(err);
  }

  // upload to storage
  let storedKey: string;
  try {
    const buffer = Buffer.from(b64, "base64");
    const key = `coins/${crypto.randomUUID()}.png`;
    storedKey = await uploadCoinImage({
      buffer,
      contentType: "image/png",
      key,
    });
  } catch (err) {
    console.error("Storage upload error:", err);
    return handleStorageError(err);
  }

  const publicBase = process.env.PUBLIC_BUCKET_PROXY_URL;
  const imageUrl = `${publicBase.replace(/\/+$/, "")}/${storedKey}`;

  return NextResponse.json({ imageUrl }, { status: 200 });
}

function errorResponse(
  error: string,
  code: string,
  status: number,
  detail?: string
) {
  return NextResponse.json(
    { error, code, ...(detail && { detail }) },
    { status }
  );
}

function handleOpenAIError(err: unknown): NextResponse {
  if (err instanceof OpenAI.APIError) {
    const { status, message } = err;

    // rate limit
    if (status === 429) {
      return errorResponse(
        "Rate limit exceeded. Please try again in a moment.",
        "RATE_LIMIT_EXCEEDED",
        429,
        message
      );
    }

    // content violation
    if (status === 400 && message.toLowerCase().includes("safety")) {
      return errorResponse(
        "Your prompt was flagged by content moderation. Please try a different prompt.",
        "CONTENT_POLICY_VIOLATION",
        400,
        message
      );
    }

    // auth
    if (status === 401) {
      return errorResponse(
        "Image generation service authentication failed.",
        "AUTH_ERROR",
        502,
        message
      );
    }

    // quota
    if (status === 402 || message.toLowerCase().includes("quota")) {
      return errorResponse(
        "Image generation quota exceeded.",
        "QUOTA_EXCEEDED",
        503,
        message
      );
    }

    // generic
    return errorResponse(
      "Image generation failed.",
      "OPENAI_API_ERROR",
      status ?? 500,
      message
    );
  }

  // unknown error (not an OpenAI.APIError)
  const message = err instanceof Error ? err.message : String(err);
  return errorResponse(
    "Image generation failed unexpectedly.",
    "UNKNOWN_OPENAI_ERROR",
    500,
    message
  );
}

function handleStorageError(err: unknown): NextResponse {
  const message = err instanceof Error ? err.message : String(err);

  // auth
  if (message.includes("AccessDenied") || message.includes("credentials")) {
    return errorResponse(
      "Storage service authentication failed.",
      "STORAGE_AUTH_ERROR",
      502,
      message
    );
  }

  // missing
  if (message.includes("NoSuchBucket")) {
    return errorResponse(
      "Storage configuration error.",
      "STORAGE_CONFIG_ERROR",
      502,
      message
    );
  }

  // generic
  return errorResponse(
    "Failed to save generated image.",
    "STORAGE_UPLOAD_ERROR",
    502,
    message
  );
}
