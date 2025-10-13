"use client";

import { LucideSend } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";

const Home = () => {
  return (
    <div className="w-[50vw] h-screen overflow-hidden mx-auto py-8 relative flex flex-col gap-4">
      {/* Display area */}
      <div className="h-[calc(100%-8rem)] flex flex-col items-center justify-center">
        <h1 className="font-bold text-4xl">
          Hello, how can I assist you today?
        </h1>
      </div>

      {/* Input area */}
      <div className="flex gap-4 items-center w-[100%] absolute bottom-8 left-[50%] -translate-x-[50%] rounded-sm bg-background">
        <Textarea
          className="text-lg p-4 resize-none line-clamp-6 overflow-hidden rounded-sm bg-green-400 z-100"
          placeholder="Type your message here."
        />
        <LucideSend className="cursor-pointer" size={40} />
      </div>
    </div>
  );
};

export default Home;
