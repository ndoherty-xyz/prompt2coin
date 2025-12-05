import { ImageStyles } from "@/utils/image";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";

type ImageGenerationStepProps = {
  prompt: string;
  updatePrompt: (prompt: string) => void;
  selectStyle: (style: ImageStyles) => void;
  selectedStyle: ImageStyles;
  onGenerate: () => void;
  isGenerating: boolean;
};

export const ImageGenerationStep = (props: ImageGenerationStepProps) => {
  return (
    <>
      <h3 className="text-2xl font-sans font-semibold tracking-tighter px-[24px]">
        Generate coin image
      </h3>
      <div className="flex flex-col justify-between gap-[64px] grow">
        <div className="flex flex-col gap-[24px]">
          {/* Image prompt input */}
          <div className="flex flex-col gap-[8px] px-[24px]">
            <label
              htmlFor="image-prompt-input"
              className="text-xs text-text-tertiary font-light font-sans px-[4px]"
            >
              Image prompt
            </label>
            <Textarea
              id="image-prompt-input"
              className="resize-none min-h-[108px]"
              placeholder="Enter a prompt for your image generation"
              value={props.prompt}
              onChange={(e) => props.updatePrompt(e.target.value)}
            />
          </div>
          {/* Style selection */}
          <div className="flex flex-col gap-[8px]">
            <label className="text-xs text-text-tertiary font-light font-sans px-[28px]">
              Style
            </label>
            <div className="overflow-x-scroll hide-scrollbar">
              <div className="px-[24px] flex gap-[8px] w-fit pb-[2px]">
                {Object.values(ImageStyles).map((style) => {
                  return (
                    <Button
                      key={style}
                      onClick={() => {
                        props.selectStyle(style);
                      }}
                      className="w-fit"
                      variant={
                        props.selectedStyle === style
                          ? "green-primary"
                          : "green-outline"
                      }
                    >
                      {style}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[8px] px-[24px]">
          <Button
            disabled={!props.prompt || props.isGenerating}
            onClick={props.onGenerate}
          >
            {props.isGenerating ? "Generating image..." : "Generate Image"}
          </Button>
        </div>
      </div>
    </>
  );
};
