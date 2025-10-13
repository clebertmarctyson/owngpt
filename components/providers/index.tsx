import React from "react";

import ThemeProvider from "@/components/providers/ThemeProvider";

import { Toaster } from "@/components/ui/sonner";

import { CheckIcon, XIcon } from "lucide-react";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster position="top-right" closeButton={true} />
    </ThemeProvider>
  );
};

export default Providers;
