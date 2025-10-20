"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";

import { queryClient } from "@/components/providers";

export default function DeleteButton({
  conversationId,
  onDeleted,
}: {
  conversationId: string;
  onDeleted?: () => void;
}) {
  const { id } = useParams();

  const router = useRouter();

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      toast.success("Conversation deleted");
      onDeleted?.();
      await queryClient.invalidateQueries({ queryKey: ["conversations"] });

      if (id === conversationId) {
        router.push("/conversations");
      }

      router.refresh();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to delete conversation");
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild className="cursor-pointer">
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={isDeleting}
          onClick={(e) => e.stopPropagation()}
        >
          <Trash size={16} className="text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this conversation? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
