"use client";

import { FolderArchive, MessageCircle, Plus } from "lucide-react";

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
import DeleteButton from "@/components/conversation/DeleteButton";

import { Conversation } from "@prisma/client";

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
                    <div className="flex items-center justify-between w-full group">
                      <SidebarMenuButton asChild className="flex-1">
                        <Link href={`/conversations/${conversation.id}`}>
                          <span className="truncate">{conversation.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <DeleteButton conversationId={conversation.id} />
                      </div>
                    </div>
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
