import { Button } from "@/components/ui/button";
import { BASESCAN_TX_URL, ZORA_COIN_URL } from "@/utils/constants";
import { EyeIcon } from "lucide-react";

type SuccessStepProps = {
  txnHash: string;
  coinAddress: string | undefined;
  reset: () => void;
};

export const SuccessStep = (props: SuccessStepProps) => {
  return (
    <>
      <h3 className="text-2xl font-sans font-semibold tracking-tighter px-[24px]">
        Your coin is live!
      </h3>
      <div className="flex flex-col justify-between gap-[64px] grow">
        <div className="px-[24px] flex flex-col gap-[24px]">
          <div className="bg-foreground-tertiary p-[16px] rounded-[16px] flex justify-between items-center gap-[24px]">
            <div className="flex flex-col gap-[2px]">
              <h3 className="text-md font-sans font-medium text-text-primary tracking-tighter">
                Transaction hash
              </h3>
              <p className="text-sm font-sans font-light text-text-tertiary">
                {`${props.txnHash.slice(0, 10)}…${props.txnHash.slice(-8)}`}
              </p>
            </div>
            <Button
              onClick={() => {
                window.open(`${BASESCAN_TX_URL}${props.txnHash}`, "_blank");
              }}
              size={"icon-lg"}
              variant="ghost"
            >
              <EyeIcon size={30} className="text-text-primary" />
            </Button>
          </div>
          {props.coinAddress ? (
            <div className="bg-foreground-tertiary p-[16px] rounded-[16px] flex justify-between items-center gap-[24px]">
              <div className="flex flex-col gap-[2px]">
                <h3 className="text-md font-sans font-medium text-text-primary tracking-tighter">
                  Coin address
                </h3>
                <p className="text-sm font-sans font-light text-text-tertiary">
                  {`${props.coinAddress.slice(0, 6)}…${props.coinAddress.slice(
                    -4
                  )}`}
                </p>
              </div>
              <Button
                onClick={() => {
                  if (props.coinAddress) {
                    window.open(
                      `${ZORA_COIN_URL}${props.coinAddress}`,
                      "_blank"
                    );
                  }
                }}
                size={"icon-lg"}
                variant="ghost"
              >
                <EyeIcon size={30} className="text-text-primary" />
              </Button>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-[8px] px-[24px]">
          <Button onClick={props.reset}>Launch a new coin</Button>
        </div>
      </div>
    </>
  );
};
