"use client";

import React from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useRouter } from "next/navigation";

import { Trash } from "lucide-react";

const DeleteButton = ({
  handleClick,
}: {
  handleClick: ({ id }: { id: string }) => Promise<void>;
}) => {
  const queryClient = useQueryClient();

  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/conversations/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });

      router.refresh();
    },
    onError: (error) => {
      console.error("Error deleting conversation:", error);
    },
  });

  return <Trash onClick={handleClick as any} className="cursor-pointer" />;
};

export default DeleteButton;
