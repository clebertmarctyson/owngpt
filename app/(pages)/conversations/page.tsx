import Link from "next/link";

import { LinkIcon, Plus } from "lucide-react";

import { Separator } from "@/components/ui/separator";

import { prisma } from "@/lib/prisma";

import SearchInput from "@/components/SearchInput";

const Conversations = async ({
  searchParams,
}: {
  searchParams: Promise<{ search: string }>;
}) => {
  const { search } = await searchParams;

  const conversations = search
    ? await prisma.conversation.findMany({
        where: {
          title: {
            contains: search,
          },
        },
      })
    : await prisma.conversation.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 50,
      });

  return (
    <div className="w-[50vw] h-screen overflow-hidden mx-auto py-8 relative flex flex-col gap-8">
      <h1 className="text-3xl font-bold">Conversations</h1>

      <Separator />

      <div className="flex justify-between items-center gap-8 mt-8">
        <Link
          href="/"
          className="flex gap-4 items-center rounded-sm p-4 bg-accent"
        >
          <Plus size={20} />
          <p className="text-lg">New Conversation</p>
        </Link>

        <SearchInput />
      </div>

      <div className="flex flex-col gap-4 py-8 box-border h-[calc(100%-8rem)] overflow-y-scroll no-scrollbar">
        {conversations?.map((conversation) => (
          <Link
            key={conversation.id}
            href={`/conversations/${conversation?.id}`}
            className="flex gap-4 items-start bg-secondary w-fit rounded-sm p-4"
          >
            <p className="text-lg">{conversation?.title}</p>
            <LinkIcon size={20} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Conversations;
