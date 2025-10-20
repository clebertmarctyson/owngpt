import Link from "next/link";

import { LinkIcon, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ConversationService } from "@/services/conversation.service";

import SearchInput from "@/components/SearchInput";

export default async function Conversations({
  searchParams,
}: {
  searchParams: Promise<{ search: string }>;
}) {
  const { search } = await searchParams;

  const conversations = search
    ? await ConversationService.search(search)
    : await ConversationService.getRecent(50);

  return (
    <div className="w-[50vw] h-screen overflow-hidden mx-auto py-8 relative flex flex-col gap-8">
      <h1 className="text-3xl font-bold">Conversations</h1>
      <Separator />

      <div className="flex justify-between items-center gap-8">
        <Link
          href="/"
          className="h-full flex gap-4 p-4 items-center rounded-sm bg-accent"
        >
          <Plus size={20} />
          <p className="text-lg">New Conversation</p>
        </Link>

        <SearchInput className="flex-1 h-full flex gap-4 p-4 items-center rounded-sm bg-accent" />
      </div>

      <div className="flex flex-col gap-4 py-4 box-border h-[calc(100%-8rem)] overflow-y-scroll no-scrollbar">
        {conversations?.map((conversation) => (
          <Link
            key={conversation.id}
            href={`/conversations/${conversation.id}`}
            className="flex gap-4 items-start justify-between bg-black w-full rounded-sm p-2"
          >
            <p className="w-[80%] text-lg">{conversation.title}</p>
            <LinkIcon size={18} color="blue" />
          </Link>
        ))}
      </div>
    </div>
  );
}
