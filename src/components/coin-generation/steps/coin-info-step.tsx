import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type CoinInformationStepProps = {
  isLaunching: boolean;
  name: string;
  setName: (name: string) => void;
  symbol: string;
  setSymbol: (symbol: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  onLaunchClick: () => void;
  onGoBackClick: () => void;
};

const SYMBOL_MAX_LENGTH = 7;

export const CoinInformationStep = (props: CoinInformationStepProps) => {
  return (
    <>
      <h3 className="text-2xl font-sans font-semibold tracking-tighter px-[24px]">
        Enter coin info
      </h3>
      <div className="flex flex-col justify-between gap-[64px] grow">
        <div className="flex flex-col gap-[24px] px-[24px]">
          <div className="flex flex-col gap-[8px]">
            <label
              htmlFor="coin-name-input"
              className="text-xs text-text-tertiary font-light font-sans px-[4px]"
            >
              Coin name
            </label>
            <Input
              id="coin-name-input"
              placeholder="Enter a coin name"
              value={props.name}
              onChange={(e) => props.setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-[8px]">
            <div className="flex justify-between items-center">
              <label
                htmlFor="coin-symbol-input"
                className="text-xs text-text-tertiary font-light font-sans px-[4px]"
              >
                Coin symbol
              </label>
              <p
                className={cn(
                  "text-xs font-light font-sans px-[4px]",
                  props.symbol.length < SYMBOL_MAX_LENGTH
                    ? "text-text-tertiary"
                    : "text-red-primary"
                )}
              >
                {props.symbol.length} / 7
              </p>
            </div>

            <Input
              id="coin-symbol-input"
              placeholder="Enter a coin symbol"
              value={props.symbol}
              onChange={(e) =>
                props.setSymbol(
                  e.target.value.length <= SYMBOL_MAX_LENGTH
                    ? e.target.value.toUpperCase()
                    : props.symbol
                )
              }
            />
          </div>
          <div className="flex flex-col gap-[8px]">
            <label
              htmlFor="coin-desc-input"
              className="text-xs text-text-tertiary font-light font-sans px-[4px]"
            >
              Coin description
            </label>
            <Textarea
              id="coin-desc-input"
              className="resize-none min-h-[72px]"
              placeholder="Enter a coin description"
              value={props.description}
              onChange={(e) => props.setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-[8px] px-[24px]">
          <Button
            disabled={!props.name || !props.symbol || props.isLaunching}
            onClick={props.onLaunchClick}
          >
            {props.isLaunching ? "Launching coin..." : "Launch coin"}
          </Button>
          <Button variant={"outline"} onClick={props.onGoBackClick}>
            Go back
          </Button>
        </div>
      </div>
    </>
  );
};
