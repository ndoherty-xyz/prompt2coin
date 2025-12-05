import { createConfig, http } from "wagmi";
import { base, mainnet } from "wagmi/chains";
import { injected, walletConnect, coinbaseWallet } from "wagmi/connectors";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error("Wallet connect project id not configured");
}

export const wagmiConfig = createConfig({
  chains: [base, mainnet],
  connectors: [
    injected({}),
    walletConnect({
      projectId: projectId,
      metadata: {
        name: "prompt2coin",
        description: "Generate AI images and launch Zora coins in one flow",
        url: "https://prompt2coin.up.railway.app",
        icons: [],
      },
    }),
    coinbaseWallet({
      appName: "prompt2coin",
    }),
  ],
  transports: {
    [base.id]: http(
      process.env.NEXT_PUBLIC_BASE_RPC_URL || "https://mainnet.base.org"
    ),
    [mainnet.id]: http(),
  },
});
