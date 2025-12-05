"use client";

import { createContext, useContext, useEffect, useState } from "react";
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

  const {
    error: connectError,
    mutate: connect,
    reset,
  } = useConnect({
    mutation: {
      onSuccess() {
        props.setOpen(false);
        // ensure we're on base
        if (chainId !== base.id) {
          switchChain({ chainId: base.id });
        }
      },
    },
  });

  const connectors = useConnectors();

  useEffect(() => {
    if (props.open) reset();
  }, [props.open]);

  return (
    <ReusableModal
      open={props.open}
      setOpen={(o) => props.setOpen(o)}
      modalTitle="Connect wallet"
      className="md:max-w-[400px]"
    >
      <div className="flex flex-col gap-[20px]">
        <p className="text-center font-sans text-sm text-text-tertiary font-light">
          Choose a wallet option below
        </p>

        <div className="flex flex-col gap-2">
          {connectors.map((connector) => {
            if (connector.name === "Injected" && typeof window !== undefined) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              if (!(window as any).ethereum) {
                return null;
              } else {
                // only show browser wallet if window.ethereum is there
                return (
                  <Button
                    variant="secondary"
                    key={connector.id}
                    onClick={() => {
                      connect({ connector });
                    }}
                  >
                    Browser Wallet
                  </Button>
                );
              }
            } else {
              return (
                <Button
                  variant="secondary"
                  key={connector.id}
                  onClick={() => {
                    if (connector.name === "WalletConnect") {
                      props.setOpen(false);
                    }
                    connect({ connector });
                  }}
                >
                  {connector.name}
                </Button>
              );
            }
          })}

          {connectError && (
            <p className="text-red-primary font-sans text-sm">
              {connectError.message}
            </p>
          )}
        </div>
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
