export enum ImageStyles {
  COMIC_BOOK = "Comic Book",
  REALISTIC = "Realistic",
  OIL_PAINTING = "Oil Painting",
  SURREAL = "Surreal",
}

export const stylePromptMapping: Record<ImageStyles, string> = {
  [ImageStyles.COMIC_BOOK]: "As a drawing in a comic book.",
  [ImageStyles.REALISTIC]: "As a realistic photograph.",
  [ImageStyles.OIL_PAINTING]: "As an oil painting.",
  [ImageStyles.SURREAL]: "In a surreal style.",
};

export class ImageApiError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = "ImageApiError";
    this.code = code;
  }
}

export async function callImageApi(
  prompt: string,
  style: ImageStyles
): Promise<string> {
  const promptObject = {
    prompt,
    style: stylePromptMapping[style],
  };

  let res: Response;
  try {
    res = await fetch("/api/generate-image", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ prompt: JSON.stringify(promptObject) }),
    });
  } catch {
    throw new ImageApiError(
      "Network error. Please check your connection.",
      "NETWORK_ERROR"
    );
  }

  if (!res.ok) {
    let body: { error?: string; code?: string };
    try {
      body = await res.json();
    } catch {
      body = {};
    }
    throw new ImageApiError(
      body.error || "Image generation failed.",
      body.code || "UNKNOWN"
    );
  }

  const data = await res.json();
  return data.imageUrl as string;
}
