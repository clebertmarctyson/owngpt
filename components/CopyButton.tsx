"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";

const CopyButton = ({ text }: { text: string }) => {
  return (
    <Copy
      className="cursor-pointer self-end"
      size={30}
      onClick={() => {
        navigator.clipboard.writeText(text);
        toast("Copied to clipboard");
      }}
    />
  );
};

export default CopyButton;
