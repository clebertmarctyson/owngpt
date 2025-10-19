import Link from "next/link";

import { LinkIcon, Plus, Trash } from "lucide-react";

import { Separator } from "@/components/ui/separator";

import { prisma } from "@/lib/prisma";

import SearchInput from "@/components/SearchInput";

import { revalidatePath } from "next/cache";
import DeleteButton from "@/components/DeleteButton";

const Conversations = async ({
  searchParams,
}: {
  searchParams: Promise<{ search: string }>;
}) => {
  const { search } = await searchParams;

  const handleClick = async ({ id }: { id: string }) => {
    "use server";
    await prisma.conversation.delete({
      where: {
        id,
      },
    });

    revalidatePath("/conversations");
  };

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

      <ul className="flex flex-col gap-4 py-4 box-border h-[calc(100%-8rem)] overflow-y-scroll no-scrollbar">
        {conversations?.map((conversation) => (
          <li key={conversation.id} className="flex gap-4 items-center">
            <p className="w-[80%] text-lg">{conversation?.title}</p>

            <div className="flex justify-between items-center gap-4">
              <Link
                key={conversation.id}
                href={`/conversations/${conversation?.id}`}
              >
                <LinkIcon size={25} />
              </Link>

              <DeleteButton handleClick={handleClick} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Conversations;
