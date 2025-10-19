"use client";

import { FolderArchive, MessageCircle, Plus, Trash } from "lucide-react";

import { QueryClient, useMutation } from "@tanstack/react-query";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import Link from "next/link";

import { Conversation } from "@prisma/client";

import { useRouter } from "next/navigation";

const items = [
  {
    title: "Projects",
    url: "/projects",
    icon: FolderArchive,
  },
  {
    title: "Conversations",
    url: "/conversations",
    icon: MessageCircle,
  },
];

const SideBar = ({
  conversations,
  ...props
}: {
  conversations: Conversation[];
} & React.ComponentProps<typeof Sidebar>) => {
  const { open } = useSidebar();

  const queryClient = new QueryClient();

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

  return (
    <Sidebar {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-bold text-2xl mb-8">
            OwnGPT
          </SidebarGroupLabel>
          <SidebarGroupContent className="space-y-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/" className="bg-accent">
                    <Plus />
                    <span>New Conversation</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            {open && (
              <SidebarMenu>
                <SidebarGroupLabel>Recents</SidebarGroupLabel>

                {conversations.map((conversation) => (
                  <SidebarMenuItem key={conversation.id}>
                    <SidebarMenuButton>
                      <Link href={`/conversations/${conversation.id}`}>
                        <span>{conversation.title}</span>
                      </Link>
                      <Trash
                        className="ml-auto"
                        onClick={() => mutate(conversation.id)}
                      />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SideBar;
