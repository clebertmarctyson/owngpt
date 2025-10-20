import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import { ConversationService } from "@/services/conversation.service";
import MessageList from "@/components/conversation/MessageList";
import ConversationForm from "@/components/conversation/ConversationForm";

async function ConversationContent({ id }: { id: string }) {
  const conversation = await ConversationService.getById(id);

  if (!conversation) {
    return <p className="text-muted-foreground">Conversation not found.</p>;
  }

  return (
    <div className="w-[50vw] h-screen overflow-hidden mx-auto py-8 relative flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-foreground">Conversations</h1>
      <Separator />

      <div className="flex flex-col gap-4 box-border h-[calc(100%-8rem)] overflow-y-scroll no-scrollbar">
        <MessageList messages={conversation.messages} />
      </div>

      <ConversationForm />
    </div>
  );
}

export default async function ConversationDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConversationContent id={id} />
    </Suspense>
  );
}
