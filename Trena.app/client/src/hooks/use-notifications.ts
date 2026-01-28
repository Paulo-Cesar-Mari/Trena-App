
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@shared/routes';
import { apiRequest } from '../lib/queryClient';
import type { Notification } from '@shared/schema';

const getNotifications = async () => {
    const response = await apiRequest('GET', api.notifications.list.path);
    if (!response.ok) {
        throw new Error('Failed to fetch notifications');
    }
    return response.json() as Promise<Notification[]>;
};

const markAsRead = async (notificationIds: number[]) => {
    const response = await apiRequest('POST', api.notifications.markAsRead.path, { notificationIds });
    if (!response.ok) {
        throw new Error('Failed to mark notifications as read');
    }
    return response.json();
};

export const useNotifications = () => {
    const queryClient = useQueryClient();

    const { data: notifications, ...queryInfo } = useQuery({
        queryKey: ['notifications'],
        queryFn: getNotifications,
    });

    const mutation = useMutation({
        mutationFn: markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });

    const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

    return {
        notifications,
        unreadCount,
        markAsReadMutation: mutation,
        ...queryInfo,
    };
};
