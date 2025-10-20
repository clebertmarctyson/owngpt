"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import DeleteButton from "@/components/conversation/DeleteButton";
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

import { API_ENDPOINTS, APP_CONFIG } from "@/lib/constants";
import { FolderArchive, MessageCircle, Plus } from "lucide-react";

export default function SidebarClient() {
  const { open } = useSidebar();

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const res = await fetch(
        `${API_ENDPOINTS.conversations}?limit=${APP_CONFIG.recentConversationsLimit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch conversations");

      return res.json();
    },
    initialData: [],
    enabled: open,
  });

  const items = [
    { title: "Conversations", url: "/conversations", icon: MessageCircle },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-bold text-2xl mb-8">
            {APP_CONFIG.name}
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
                {isLoading ? (
                  <div className="p-4 text-sm text-muted-foreground">
                    Loading...
                  </div>
                ) : (
                  conversations.map((conversation: any) => (
                    <SidebarMenuItem key={conversation.id}>
                      <div className="flex items-center justify-between w-full group">
                        <SidebarMenuButton asChild className="flex-1">
                          <Link href={`/conversations/${conversation.id}`}>
                            <span className="truncate">
                              {conversation.title}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <DeleteButton conversationId={conversation.id} />
                        </div>
                      </div>
                    </SidebarMenuItem>
                  ))
                )}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
