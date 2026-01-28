import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { queryClient, api } from "../lib/queryClient";
import { useAuth } from "../hooks/use-auth";
import { useParams } from "wouter";

const messageSchema = z.object({
  content: z.string().min(1, "A mensagem não pode estar vazia."),
});

const ChatView = () => {
  const { user } = useAuth();
  const params = useParams();
  const otherUserId = Number(params.id);

  const { data: messages, isLoading } = useQuery({
    queryKey: ["messages", otherUserId],
    queryFn: async () => {
      const res = await api.messages[":id"].$get({
        param: { id: otherUserId.toString() },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch messages");
      }
      return await res.json();
    },
    enabled: !!user && !!otherUserId,
  });

  const mutation = useMutation({
    mutationFn: async (newMessage: z.infer<typeof messageSchema>) => {
      const res = await api.messages[":id"].$post({
        param: { id: otherUserId.toString() },
        json: newMessage,
      });
      if (!res.ok) {
        throw new Error("Failed to send message");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", otherUserId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = (values: z.infer<typeof messageSchema>) => {
    mutation.mutate(values);
    form.reset();
  };

  return (
    <Card className="p-4">
      {isLoading ? (
        <p>Carregando mensagens...</p>
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            {messages?.map((message) => (
              <div
                key={message.id}
                className={`flex items-start my-2 ${
                  message.senderId === user?.id ? "justify-end" : ""
                }`}
              >
                <div className="flex items-center">
                  <Avatar>
                    <AvatarImage src={message.sender.avatar} />
                    <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <p className="font-bold">{message.sender.name}</p>
                    <p>{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="Digite sua mensagem..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="ml-2">
                  Enviar
                </Button>
              </form>
            </Form>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ChatView;
