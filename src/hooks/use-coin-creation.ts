"use client";

import { useState, useCallback } from "react";
import { callImageApi, ImageApiError, ImageStyles } from "@/utils/image";
import { errorToast } from "@/components/ui/sonner";
import {
  createMetadataBuilder,
  createZoraUploaderForCreator,
  createCoin,
  CreateConstants,
  setApiKey,
} from "@zoralabs/coins-sdk";
import { useConnection, usePublicClient, useWalletClient } from "wagmi";
import { base } from "viem/chains";
import { TransactionExecutionError } from "viem";

export type CoinFormValues = {
  name: string;
  symbol: string;
  description: string;
  prompt: string;
};

export type TxInfo = {
  hash: string;
  coinAddress?: string;
};

export type FormStep =
  | { step: "imgGen"; isGenerating: boolean }
  | { step: "coinInfo"; isLaunching: boolean }
  | { step: "launched"; txInfo: TxInfo };

export function useCoinCreation() {
  const { address } = useConnection();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [values, setValues] = useState<CoinFormValues>({
    name: "",
    symbol: "",
    description: "",
    prompt: "",
  });

  const [selectedStyle, setSelectedStyle] = useState<ImageStyles>(
    ImageStyles.COMIC_BOOK
  );

  const [formStep, setFormStep] = useState<FormStep>({
    step: "imgGen",
    isGenerating: false,
  });
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  function updateField<K extends keyof CoinFormValues>(
    key: K,
    value: CoinFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  const goBackToImageGen = useCallback(() => {
    setFormStep({ step: "imgGen", isGenerating: false });
  }, []);

  const reset = useCallback(() => {
    setImageUrl(null);
    setValues({
      name: "",
      symbol: "",
      description: "",
      prompt: "",
    });
    setFormStep({ step: "imgGen", isGenerating: false });
  }, []);

  const generateImage = useCallback(async () => {
    setImageUrl(null);
    setFormStep({ step: "imgGen", isGenerating: true });

    try {
      const url = await callImageApi(values.prompt, selectedStyle);
      setImageUrl(url);
      setFormStep({ step: "coinInfo", isLaunching: false });
    } catch (err) {
      if (err instanceof ImageApiError) {
        errorToast({ message: err.message });
      } else {
        errorToast({ message: "Something unexpected went wrong." });
      }
      setFormStep({ step: "imgGen", isGenerating: false });
    }
  }, [values.prompt, selectedStyle]);

  const launchCoin = useCallback(async () => {
    if (!address || !walletClient || !publicClient) {
      errorToast({ message: "No wallet connected" });
      return;
    }

    if (!imageUrl || !values.name || !values.symbol) {
      errorToast({ message: "Invalid inputs for coin creation" });
      return;
    }

    setFormStep({ step: "coinInfo", isLaunching: true });

    if (!process.env.NEXT_PUBLIC_ZORA_API_KEY) {
      errorToast({ message: "Misconfigured Zora API key" });
      return;
    }
    setApiKey(process.env.NEXT_PUBLIC_ZORA_API_KEY);

    try {
      const { createMetadataParameters } = await createMetadataBuilder()
        .withName(values.name)
        .withSymbol(values.symbol)
        .withDescription(values.description || "")
        .withImageURI(imageUrl)
        .upload(createZoraUploaderForCreator(address));

      const result = await createCoin({
        call: {
          ...createMetadataParameters,
          currency: CreateConstants.ContentCoinCurrencies.ZORA,
          chainId: base.id,
          creator: address,
          startingMarketCap: CreateConstants.StartingMarketCaps.LOW,
        },
        walletClient,
        publicClient,
      });

      setFormStep({
        step: "launched",
        txInfo: {
          hash: result.hash,
          coinAddress: result.deployment?.coin,
        },
      });
    } catch (e) {
      let message = "Failed to create coin.";
      if (
        e instanceof TransactionExecutionError &&
        e.details.toLowerCase().includes("user cancelled")
      ) {
        message = "Transaction cancelled";
      } else if (e instanceof Error) {
        message = e.message;
      }

      errorToast({ message });
      console.error(e);
      setFormStep({ step: "coinInfo", isLaunching: false });
    }
  }, [
    address,
    imageUrl,
    publicClient,
    values.description,
    values.name,
    values.symbol,
    walletClient,
  ]);

  return {
    values,
    updateField,
    selectedStyle,
    setSelectedStyle,
    formStep,
    imageUrl,
    generateImage,
    launchCoin,
    goBackToImageGen,
    reset,
  };
}
