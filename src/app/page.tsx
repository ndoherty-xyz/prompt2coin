"use client";

import { CoinGenerationForm } from "@/components/coin-generation/coin-generation-form";
import { ConnectWalletButton } from "@/components/wallet-connection/connect-wallet-button";

export default function Home() {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      <div className="flex justify-between p-[16px] items-center fixed w-full top-0 px-[12px] md:px-[144px]">
        <h1 className="font-sans font-semibold text-2xl tracking-tighter">
          prompt2coin
        </h1>
        <ConnectWalletButton />
      </div>
      <div className="my-[108px] w-full flex items-center justify-center">
        <CoinGenerationForm />
      </div>
    </div>
  );
}
