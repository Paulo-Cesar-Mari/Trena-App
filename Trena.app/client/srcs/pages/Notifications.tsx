
import { Bell, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'wouter';
import { useNotifications } from '@/hooks/use-notifications';
import { useEffect } from 'react';
import { Notification } from '@shared/schema';

export default function Notifications() {
    const { data: notifications, isLoading, error, markAsReadMutation, unreadCount } = useNotifications();

    const handleMarkAllAsRead = () => {
        const unreadIds = notifications?.filter((n: Notification) => !n.isRead).map((n: Notification) => n.id) || [];
        if (unreadIds.length > 0) {
            markAsReadMutation.mutate(unreadIds);
        }
    };

    // Mark notifications as read when the page is visited
    useEffect(() => {
        if (unreadCount > 0) {
            const unreadIds = notifications?.filter((n: Notification) => !n.isRead).map((n: Notification) => n.id) || [];
            if (unreadIds.length > 0) {
                markAsReadMutation.mutate(unreadIds);
            }
        }
    }, [notifications]);

    return (
        <div className="pb-24 min-h-screen bg-gray-50">
            <div className="bg-white pt-12 pb-6 px-4 sm:px-6 shadow-sm sticky top-0 z-30">
                <div className="flex items-center gap-4 max-w-4xl mx-auto relative">
                    <button onClick={() => window.history.back()} className="absolute left-0">
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <h1 className="text-xl font-bold text-center flex-1">
                        Notificações
                    </h1>
                </div>
            </div>

            <div className="px-4 pt-8 space-y-3 max-w-4xl mx-auto">
                {isLoading && <p>Carregando...</p>}
                {error && <p className="text-red-500">Erro ao carregar notificações.</p>}

                {notifications?.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                            <Bell className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Nenhuma notificação</h3>
                        <p className="text-gray-500 max-w-xs mt-2 mx-auto">
                            Você não tem nenhuma notificação pendente.
                        </p>
                    </div>
                )}

                {notifications?.map((notification: Notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                ))}
            </div>
        </div>
    );
}

const NotificationItem = ({ notification }: { notification: Notification }) => (
    <Link href={notification.link}>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.isRead ? 'bg-gray-100' : 'bg-primary/10'}`}>
                <Bell className={`w-5 h-5 ${notification.isRead ? 'text-gray-400' : 'text-primary'}`} />
            </div>
            <div className="flex-1">
                <p className={`text-sm ${notification.isRead ? 'text-gray-500' : 'text-gray-800 font-semibold'}`}>
                    {notification.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                </p>
            </div>
            {!notification.isRead && (
                <div className="w-3 h-3 bg-primary rounded-full" />
            )}
        </div>
    </Link>
);
