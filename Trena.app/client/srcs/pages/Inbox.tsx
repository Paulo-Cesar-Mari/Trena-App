import { useQuery } from "@tanstack/react-query";
import { Link, Route, useRoute } from "wouter";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { api } from "@shared/routes";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import ChatView from "./ChatView";
import { User } from "@shared/schema";

// This type should reflect what the backend API returns for a conversation list
type Conversation = {
    otherUser: Pick<User, 'id' | 'name' | 'avatar'>;
    lastMessage: {
        id: number;
        content: string;
        createdAt: string; // Dates are strings over JSON
        senderId: number;
    };
    unreadCount: number;
};

const Inbox = () => {
  const { user } = useAuth();
  const [isChatView, params] = useRoute("/inbox/:id");

  const { data: conversations, isLoading } = useQuery<Conversation[]>({
    queryKey: ["conversations"],
    queryFn: async () => {
      const res = await apiRequest("GET", api.messages.conversations.path);
      if (!res.ok) {
        throw new Error("Failed to fetch conversations");
      }
      return res.json();
    },
    enabled: !!user,
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Caixa de Entrada</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1">
          <Card>
            {isLoading ? (
              <p>Carregando conversas...</p>
            ) : (
              <ul>
                {conversations?.map((convo) => (
                  <li key={convo.otherUser.id}>
                    <Link href={`/inbox/${convo.otherUser.id}`}>
                      <a className="block p-4 hover:bg-gray-100">
                        <div className="flex items-center">
                          <Avatar>
                            <AvatarImage src={convo.otherUser.avatar || undefined} />
                            <AvatarFallback>{convo.otherUser.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="ml-4">
                            <p className="font-bold">{convo.otherUser.name}</p>
                            <p className="text-sm text-gray-600">{convo.lastMessage.content}</p>
                          </div>
                        </div>
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
        <div className="col-span-2">
          {isChatView && params?.id ? (
            <ChatView key={params.id} />
          ) : (
            <Card className="p-4 flex items-center justify-center h-full">
              <p className="text-gray-500">Selecione uma conversa para começar.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inbox;
