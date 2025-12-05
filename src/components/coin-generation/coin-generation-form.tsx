import { AnimatePresence, motion } from "framer-motion";
import { CoinPreviewCard } from "./coin-preview";
import { ImageGenerationStep } from "./steps/image-generation-step";
import { CoinInformationStep } from "./steps/coin-info-step";
import { SuccessStep } from "./steps/success-step";
import { useCoinCreation } from "@/hooks/use-coin-creation";

const STEP_CARD_CLASS =
  "flex flex-col h-fit gap-[24px] bg-white border border-foreground-tertiary shadow-xs rounded-[16px] py-[24px] w-full";

export const CoinGenerationForm = () => {
  const {
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
  } = useCoinCreation();

  return (
    <div className="flex flex-row flex-wrap-reverse lg:flex-nowrap w-full lg:max-w-[70vw] justify-center gap-[24px] items-center px-[12px]">
      <div className="w-full lg:w-[30vw]">
        <AnimatePresence mode="popLayout">
          {formStep.step === "imgGen" && (
            <motion.div
              key="imgGen"
              className={STEP_CARD_CLASS}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
            >
              <ImageGenerationStep
                isGenerating={formStep.isGenerating}
                onGenerate={generateImage}
                selectStyle={setSelectedStyle}
                selectedStyle={selectedStyle}
                prompt={values.prompt}
                updatePrompt={(prompt: string) => updateField("prompt", prompt)}
              />
            </motion.div>
          )}
          {formStep.step === "coinInfo" && (
            <motion.div
              key="coinInfo"
              className={STEP_CARD_CLASS}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
            >
              <CoinInformationStep
                onLaunchClick={launchCoin}
                onGoBackClick={goBackToImageGen}
                isLaunching={formStep.isLaunching}
                name={values.name}
                setName={(name: string) => updateField("name", name)}
                symbol={values.symbol}
                setSymbol={(symbol: string) => updateField("symbol", symbol)}
                description={values.description}
                setDescription={(description: string) =>
                  updateField("description", description)
                }
              />
            </motion.div>
          )}
          {formStep.step === "launched" && (
            <motion.div
              key="launched"
              className={STEP_CARD_CLASS}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
            >
              <SuccessStep
                txnHash={formStep.txInfo.hash}
                coinAddress={formStep.txInfo.coinAddress}
                reset={reset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <CoinPreviewCard
        name={values.name}
        symbol={values.symbol}
        description={values.description}
        imageUrl={imageUrl}
        isGenerating={formStep.step === "imgGen" && formStep.isGenerating}
      />
    </div>
  );
};
