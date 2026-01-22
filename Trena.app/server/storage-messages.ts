import { db } from "./db";
import { messages, users } from "@shared/schema";
import type { InsertMessage } from "@shared/schema";
import { and, eq, or, desc } from "drizzle-orm";
import { sql } from 'drizzle-orm';

// A "conversation" is now represented by the other user you're talking to.
export type Conversation = {
    otherUser: {
        id: number;
        name: string;
        avatar: string | null;
    };
    lastMessage: {
        id: number;
        content: string;
        createdAt: Date | null;
        senderId: number;
    };
    unreadCount: number;
};

export type MessageWithSender = Awaited<ReturnType<typeof storageMessages.getMessagesBetweenUsers>>[0];

export const storageMessages = {
    /**
     * Retrieves a list of conversations for a given user.
     * A conversation is defined by the other participant and includes the last message.
     */
    async getConversationsForUser(userId: number): Promise<Conversation[]> {
        // 1. Find all users this user has messaged with.
        const sentMessages = await db.selectDistinct({ otherUserId: messages.receiverId }).from(messages).where(eq(messages.senderId, userId));
        const receivedMessages = await db.selectDistinct({ otherUserId: messages.senderId }).from(messages).where(eq(messages.receiverId, userId));

        const otherUserIds = Array.from(new Set([
            ...sentMessages.map(m => m.otherUserId),
            ...receivedMessages.map(m => m.otherUserId)
        ]));

        if (otherUserIds.length === 0) {
            return [];
        }

        // 2. For each "other user", get the last message, their details, and unread count.
        const conversations: Conversation[] = [];
        for (const otherUserId of otherUserIds) {
            const lastMessage = await db.query.messages.findFirst({
                where: or(
                    and(eq(messages.senderId, userId), eq(messages.receiverId, otherUserId)),
                    and(eq(messages.senderId, otherUserId), eq(messages.receiverId, userId))
                ),
                orderBy: [desc(messages.createdAt)],
            });

            const otherUser = await db.query.users.findFirst({
                where: eq(users.id, otherUserId),
                columns: {
                    id: true,
                    name: true,
                    avatar: true,
                }
            });

            const unreadResult = await db.select({
                count: sql<number>`count(*)`
            }).from(messages)
            .where(and(
                eq(messages.receiverId, userId),
                eq(messages.senderId, otherUserId),
                sql`"read_at" IS NULL`
            ));

            const unreadCount = unreadResult[0]?.count || 0;

            if (lastMessage && otherUser) {
                conversations.push({
                    otherUser: {
                        id: otherUser.id,
                        name: otherUser.name,
                        avatar: otherUser.avatar,
                    },
                    lastMessage: {
                        id: lastMessage.id,
                        content: lastMessage.content,
                        createdAt: lastMessage.createdAt,
                        senderId: lastMessage.senderId,
                    },
                    unreadCount,
                });
            }
        }

        // Sort conversations by the date of the last message
        return conversations.sort((a, b) => {
            if (!a.lastMessage.createdAt) return 1;
            if (!b.lastMessage.createdAt) return -1;
            return b.lastMessage.createdAt.getTime() - a.lastMessage.createdAt.getTime();
        });
    },

    /**
     * Creates a new message.
     */
    async createMessage(message: Omit<InsertMessage, 'readAt' | 'createdAt' | 'id'>) {
        if (message.senderId === message.receiverId) {
            throw new Error("Sender and receiver cannot be the same user.");
        }
        const [newMessage] = await db.insert(messages).values(message).returning();
        return newMessage;
    },

    /**
     * Retrieves all messages between two users and marks them as read.
     */
    async getMessagesBetweenUsers(currentUserId: number, otherUserId: number) {
        // Mark messages sent by the other user to the current user as read
        await db.update(messages)
            .set({ readAt: new Date() })
            .where(
                and(
                    eq(messages.senderId, otherUserId),
                    eq(messages.receiverId, currentUserId),
                    sql`"read_at" IS NULL`
                )
            );

        const conversationMessages = await db.query.messages.findMany({
            where: or(
                and(eq(messages.senderId, currentUserId), eq(messages.receiverId, otherUserId)),
                and(eq(messages.senderId, otherUserId), eq(messages.receiverId, currentUserId))
            ),
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
