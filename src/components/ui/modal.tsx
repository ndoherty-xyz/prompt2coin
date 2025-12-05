"use client";

import React from "react";
import { Dialog, DialogContent } from "../ui/dialog";

type ReusableModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  modalTitle?: string;
} & React.PropsWithChildren;

export const ReusableModal = (props: ReusableModalProps) => {
  return (
    <Dialog open={props.open} onOpenChange={(o) => props.setOpen(o)}>
      <DialogContent showCloseButton={false}>
        {props.modalTitle ? (
          <div className="py-[20px] px-[16px] flex items-center justify-center border-b border-slate-300">
            <h4 className="font-semibold">{props.modalTitle}</h4>
          </div>
        ) : null}
        <div className="py-[20px] px-[16px] flex flex-col">
          {props.children}
        </div>
      </DialogContent>
    </Dialog>
  );
};
