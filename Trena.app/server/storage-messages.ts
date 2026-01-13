import { db } from "./db";
import { conversations, messages, participants, users } from "@shared/schema";
import type { InsertConversation, InsertMessage, InsertParticipant } from "@shared/schema";
import { and, eq, inArray, ne } from "drizzle-orm";

export type ConversationWithParticipants = Awaited<ReturnType<typeof storageMessages.getConversation>>;
export type MessageWithSender = Awaited<ReturnType<typeof storageMessages.getMessagesForConversation>>[0];

export const storageMessages = {
    async createConversation(participantIds: number[]) {
        const [conversation] = await db
            .insert(conversations)
            .values({})
            .returning();

        const participantsData = participantIds.map(userId => ({
            userId,
            conversationId: conversation.id,
        }));

        await db.insert(participants).values(participantsData);

        return conversation;
    },

    async getConversation(conversationId: number, userId: number) {
        // Primeiro, verifique se o usuário é um participante
        const participantCheck = await db
            .select()
            .from(participants)
            .where(
                and(
                    eq(participants.conversationId, conversationId),
                    eq(participants.userId, userId)
                )
            )
            .limit(1);

        if (participantCheck.length === 0) {
            return null; // O usuário não tem permissão para ver esta conversa
        }

        const conversation = await db.query.conversations.findFirst({
            where: eq(conversations.id, conversationId),
            with: {
                participants: {
                    with: {
                        user: true,
                    },
                },
            },
        });

        return conversation;
    },

    async getConversationsForUser(userId: number) {
        const userConversations = await db.query.participants.findMany({
            where: eq(participants.userId, userId),
            with: {
                conversation: {
                    with: {
                        participants: {
                            with: {
                                user: {
                                    columns: {
                                        id: true,
                                        name: true,
                                        avatar: true,
                                    }
                                }
                            }
                        },
                        messages: {
                            orderBy: (messages, { desc }) => [desc(messages.createdAt)],
                            limit: 1,
                        }
                    }
                }
            }
        });

        return userConversations.map(p => p.conversation);
    },

    async createMessage(message: { conversationId: number, senderId: number, content: string }) {
        const [newMessage] = await db.insert(messages).values(message).returning();
        return newMessage;
    },

    async getMessagesForConversation(conversationId: number, userId: number) {
        // Verifique se o usuário é um participante antes de buscar as mensagens
        const participantCheck = await db
            .select()
            .from(participants)
            .where(
                and(
                    eq(participants.conversationId, conversationId),
                    eq(participants.userId, userId)
                )
            )
            .limit(1);

        if (participantCheck.length === 0) {
            throw new Error("Acesso negado"); // Ou retorne um array vazio
        }

        // Marcar mensagens como lidas
        await db.update(messages)
            .set({ readAt: new Date() })
            .where(
                and(
                    eq(messages.conversationId, conversationId),
                    ne(messages.senderId, userId) // Marcar as que o *outro* usuário enviou
                )
            );


        const conversationMessages = await db.query.messages.findMany({
            where: eq(messages.conversationId, conversationId),
            with: {
                sender: {
                    columns: {
                        id: true,
                        name: true,
                        avatar: true,
                    }
                },
            },
            orderBy: (messages, { asc }) => [asc(messages.createdAt)],
        });

        return conversationMessages;
    }
};
