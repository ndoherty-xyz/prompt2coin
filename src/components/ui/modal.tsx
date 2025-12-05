"use client";

import React from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { cn } from "@/lib/utils";

type ReusableModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  modalTitle?: string;
  className?: string;
} & React.PropsWithChildren;

export const ReusableModal = (props: ReusableModalProps) => {
  return (
    <Dialog open={props.open} onOpenChange={(o) => props.setOpen(o)}>
      <DialogContent showCloseButton={false} className={cn(props.className)}>
        {props.modalTitle ? (
          <div className="p-[24px] flex items-center justify-center border-b border-foreground-tertiary">
            <h4 className="font-semibold">{props.modalTitle}</h4>
          </div>
        ) : null}
        <div className="p-[24px] flex flex-col">{props.children}</div>
      </DialogContent>
    </Dialog>
  );
};
