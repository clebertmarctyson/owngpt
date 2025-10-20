"use client";

import { FolderArchive, MessageCircle, Plus, Trash } from "lucide-react";

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

import { useMutation } from "@tanstack/react-query";

import { API_ENDPOINTS } from "@/lib/constants";

import { useRouter } from "next/navigation";

import { queryClient } from "@/components/providers";

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
  const router = useRouter();

  const { open } = useSidebar();

  const { mutate: deleteConversation } = useMutation({
    mutationFn: async (conversationId: string) => {
      await fetch(`${API_ENDPOINTS.conversations}/${conversationId}`, {
        method: "DELETE",
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["conversations"] });
      router.refresh();
    },
    onError: (error) => {
      console.error(error);
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
                  <SidebarMenuItem
                    key={conversation.id}
                    className="flex gap-0.5 items-center"
                  >
                    <Trash
                      className="cursor-pointer"
                      size={20}
                      onClick={() => deleteConversation(conversation.id)}
                    />

                    <SidebarMenuButton asChild>
                      <Link href={`/conversations/${conversation.id}`}>
                        <span>{conversation.title}</span>
                      </Link>
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
