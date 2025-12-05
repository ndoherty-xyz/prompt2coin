"use client";

import {
  AlertOctagonIcon,
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  Toaster as Sonner,
  type ToasterProps,
  toast as sonnerToast,
} from "sonner";

interface ErrorToastProps {
  id: string | number;
  message: string;
}

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "white",
          "--normal-text": "var(--color-text-primary)",
          "--normal-border": "var(--color-foreground-primary)",
          "--border-radius": "16px",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export function errorToast(toast: Omit<ErrorToastProps, "id">) {
  return sonnerToast.custom((id) => <Toast id={id} message={toast.message} />, {
    duration: 10000,
  });
}

/** A fully custom toast that still maintains the animations and interactions. */
function Toast(props: ErrorToastProps) {
  const { message } = props;

  return (
    <div className="flex rounded-[16px] bg-white shadow-xs border border-red-secondary w-full md:max-w-[364px] items-center p-[16px]">
      <div className="w-full flex gap-[12px] items-start">
        <AlertOctagonIcon size={20} className="text-red-primary pt-px" />
        <p className="text-sm font-light font-sans text-red-primary">
          {message}
        </p>
      </div>
    </div>
  );
}

export { Toaster };
