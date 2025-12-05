import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";
import Image from "next/image";

type CoinPreviewCardProps = {
  name: string;
  imageUrl: string | null;
  description?: string;
  symbol: string;
  isGenerating: boolean;
};

export const CoinPreviewCard = (props: CoinPreviewCardProps) => {
  return (
    <div className="flex flex-col gap-[16px] p-[24px] rounded-[16px] border border-foreground-tertiary bg-white w-fit max-w-[348px] h-fit shadow-xs transition-all ease-out duration-150">
      <div className="w-[300px] aspect-square bg-foreground-tertiary flex items-center justify-center rounded-[8px] overflow-hidden">
        {props.imageUrl ? (
          <Image
            alt="Generated image"
            src={props.imageUrl}
            className="w-full h-full object-cover"
            width={400}
            height={400}
          />
        ) : (
          <ImageIcon
            size={50}
            className={cn(
              "text-text-tertiary",
              props.isGenerating ? "animate-spin" : ""
            )}
          />
        )}
      </div>
      <div className="flex flex-col gap-[4px]">
        <div className="flex justify-between gap-[16px] items-start">
          <h3 className="font-medium tracking-tight font-stretch-condensed font-headline text-2xl">
            {props.name ? props.name : "Coin Title"}
          </h3>
          <h6 className="font-light text-gray-500 text-sm break-all">
            ({props.symbol ? props.symbol : "SYMBOL"})
          </h6>
        </div>

        {props.description ? (
          <p className="text-gray-500 text-md">{props.description}</p>
        ) : null}
      </div>
    </div>
  );
};
