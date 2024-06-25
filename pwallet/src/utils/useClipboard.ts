import { useState } from "react";

const useClipboard = (initialText = "Copy to clipboard") => {
  const [tooltipText, setTooltipText] = useState(initialText);
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setTooltipText("Copied!");
      setOpen(true);
      setCopied(true);
      setTimeout(() => {
        setTooltipText(initialText);
        setOpen(false);
        setCopied(false);
      }, 3000);
    });
  };

  return { tooltipText, copied, open, copyToClipboard, setOpen };
};

export default useClipboard;
