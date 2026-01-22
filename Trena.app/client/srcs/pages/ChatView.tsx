import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { api, buildUrl } from "@shared/routes";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useParams } from "wouter";
import { Message, User } from "@shared/schema";
import { Send } from "lucide-react";
import { useEffect, useRef } from "react";

type MessageWithSender = Message & { sender: Pick<User, 'id' | 'name' | 'avatar'> };

const ChatView = () => {
  const { user } = useAuth();
  const params = useParams();
  const otherUserId = Number(params.id);
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: messages, isLoading } = useQuery<MessageWithSender[]>({
    queryKey: ["messages", otherUserId],
    queryFn: async () => {
      const url = buildUrl(api.messages.messages.path, { id: otherUserId });
      const res = await apiRequest("GET", url);
      if (!res.ok) throw new Error("Failed to fetch messages");
      return res.json();
    },
    enabled: !!user && !!otherUserId,
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  const mutation = useMutation({
    mutationFn: async (newMessage: { content: string }) => {
      const url = buildUrl(api.messages.sendMessage.path, { id: otherUserId });
      const res = await apiRequest("POST", url, newMessage);
      if (!res.ok) throw new Error("Failed to send message");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", otherUserId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  const { register, handleSubmit, reset } = useForm<{ content: string }>();

  const onSubmit = (values: { content: string }) => {
    if (!values.content.trim()) return;
    mutation.mutate(values);
    reset();
  };

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);


  if (isLoading) {
    return <Card className="p-4 h-[60vh] flex items-center justify-center"><p>Carregando mensagens...</p></Card>;
  }

  if (!messages || messages.length === 0) {
    return <Card className="p-4 h-[60vh] flex items-center justify-center"><p>Nenhuma mensagem ainda. Envie a primeira!</p></Card>;
  }

  return (
    <Card className="flex flex-col h-[60vh]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.senderId === user?.id ? "flex-row-reverse" : ""
            }`}
          >
            <Avatar className="w-8 h-8">
              <AvatarImage src={message.sender.avatar || undefined} />
              <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
            </Avatar>
            <div className={`p-3 rounded-lg max-w-xs ${
                message.senderId === user?.id ? 'bg-primary text-secondary' : 'bg-gray-100'
            }`}>
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2">
            <Input
                {...register("content")}
                placeholder="Digite sua mensagem..."
                className="flex-1"
                autoComplete="off"
            />
          <Button type="submit" disabled={mutation.isPending} size="icon" className="w-10 h-10">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default ChatView;
