"use client";

import { useDisconnect, useEnsName, useEnsAvatar, useConnection } from "wagmi";
import { mainnet } from "wagmi/chains";
import { Button } from "../ui/button";
import { useConnectWalletModalContext } from "./connect-wallet-modal";
import { User, XIcon } from "lucide-react";
import Image from "next/image";

export function ConnectWalletButton() {
  const connectWalletModal = useConnectWalletModalContext();

  const { address, isConnected } = useConnection();
  const { mutate: disconnect } = useDisconnect();

  const { data: ensName } = useEnsName({
    address,
    chainId: mainnet.id,
  });
  const { data: ensAvatar } = useEnsAvatar({
    name: ensName ?? undefined,
    chainId: mainnet.id,
  });

  if (isConnected) {
    const displayName =
      ensName ?? (address && `${address.slice(0, 6)}…${address.slice(-4)}`);

    return (
      <div className="flex items-center gap-[10px] rounded-full bg-white w-fit p-[3px] border border-foreground-tertiary shadow-xs">
        <div className="size-[36px] rounded-full overflow-hidden bg-foreground-tertiary flex items-center justify-center relative text-text-primary">
          {ensAvatar ? (
            <Image
              src={ensAvatar}
              alt={ensName ?? "Avatar"}
              fill
              className="object-cover"
              unoptimized // ENS avatars are external URLs
            />
          ) : (
            <User className="size-4 text-text-primary" />
          )}
        </div>
        <span className="text-sm font-medium text-text-primary font-sans mr-[6px]">
          {displayName}
        </span>
        <Button
          variant="destructive-ghost"
          size="icon"
          className="h-full aspect-square rounded-full"
          onClick={() => disconnect()}
        >
          <XIcon />
        </Button>
      </div>
    );
  }

  return (
    <Button variant="default" onClick={() => connectWalletModal.setOpen(true)}>
      Connect Wallet
    </Button>
  );
}
