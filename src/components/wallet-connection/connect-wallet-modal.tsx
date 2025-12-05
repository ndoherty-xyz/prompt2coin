"use client";

import { createContext, useContext, useState } from "react";
import { useChainId, useConnect, useConnectors, useSwitchChain } from "wagmi";
import { Button } from "../ui/button";
import { ReusableModal } from "../ui/modal";
import { base } from "viem/chains";

type ConnectWalletModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const ConnectWalletModal = (props: ConnectWalletModalProps) => {
  const { mutate: switchChain } = useSwitchChain();
  const chainId = useChainId();

  const { error: connectError, mutate: connect } = useConnect({
    mutation: {
      onSuccess() {
        // ensure we're on base
        if (chainId !== base.id) {
          switchChain({ chainId: base.id });
        }
      },
    },
  });

  const connectors = useConnectors();

  return (
    <ReusableModal
      open={props.open}
      setOpen={(o) => props.setOpen(o)}
      modalTitle="Connect wallet"
    >
      <div className="flex flex-col gap-2">
        {connectors.map((connector) => (
          <Button
            variant="default"
            key={connector.id}
            onClick={() => {
              if (connector.name === "WalletConnect") {
                props.setOpen(false);
              }
              connect({ connector });
            }}
          >
            {connector.name === "Injected" ? "Browser Wallet" : connector.name}
          </Button>
        ))}

        {connectError && (
          <p className="text-red-primary font-sans text-sm">
            {connectError.message}
          </p>
        )}
      </div>
    </ReusableModal>
  );
};

type ConnectWalletModalContextProps = {
  setOpen: (open: boolean) => void;
};
export const ConnectWalletModalContext = createContext<
  ConnectWalletModalContextProps | undefined
>(undefined);

export const useConnectWalletModalContext =
  (): ConnectWalletModalContextProps => {
    const context = useContext(ConnectWalletModalContext);
    if (!context) {
      throw new Error(
        "useSetConnectWalletModalContext must be used within an ConnectWalletModalProvider"
      );
    }
    return context;
  };

export const ConnectWalletModalProvider = (props: React.PropsWithChildren) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <ConnectWalletModalContext.Provider value={{ setOpen }}>
      {props.children}
      <ConnectWalletModal open={open} setOpen={setOpen} />
    </ConnectWalletModalContext.Provider>
  );
};
