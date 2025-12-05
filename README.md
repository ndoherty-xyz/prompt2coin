# prompt2coin

Turn a text prompt into a Zora coin. Generate an image, add some coin information, and launch it on Base.


## Demo video

https://github.com/user-attachments/assets/7fea22e8-090a-417a-955e-9a3a316581d8


## Demo link
https://prompt2coin.up.railway.app


## How It Works

1. **Write a prompt** — Describe what you want, pick an art style
2. **Generate the image** — Using OpenAI apis
3. **Add coin details** — Name, symbol, description
4. **Launch** — Signs a transaction, coin goes live on Zora

## Stack

| Layer      | What                          |
| ---------- | ----------------------------- |
| Framework  | Next.js 16, React 19          |
| Styling    | Tailwind CSS, Framer Motion   |
| Wallet     | Wagmi v3, Viem, WalletConnect |
| Blockchain | Zora Coins SDK, Base          |
| AI         | OpenAI DALL-E 3               |
| Storage    | S3-compatible (Railway)       |

## Basic structure

- **Custom form hook** — `useCoinCreation` contains form state and logic
- **Server route** — `/api/generate-image` handles OpenAI calls and S3 uploads
- **Error handling** — Rate limits, content policy violations, and network errors are caught and surfaced via toast notifications

## Running Locally

```bash
npm install
npm run dev
```

You'll need these env vars:

| Variable                               | What it's for             |
| -------------------------------------- | ------------------------- |
| `OPENAI_API_KEY`                       | DALL-E 3 image generation |
| `NEXT_PUBLIC_ZORA_API_KEY`             | Zora SDK                  |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect             |
| `NEXT_PUBLIC_BASE_RPC_URL`             | Base RPC (optional)       |
| `RAILWAY_BUCKET_*`                     | S3 credentials for images |
| `PUBLIC_BUCKET_PROXY_URL`              | Public CDN URL for images |

## Project Layout

```
src/
├── app/
│   ├── api/generate-image/   # Server route: OpenAI + S3
│   ├── page.tsx              # The app
│   └── providers.tsx         # Wagmi, React Query, etc
├── hooks/
│   └── use-coin-creation.ts  # The form logic hook
├── components/
│   ├── coin-generation/      # The coin creation form
│   ├── wallet-connection/    # Connect button + modal
│   └── ui/                   # Buttons, inputs, etc
└── utils/                    # API client, S3, wagmi config
```
