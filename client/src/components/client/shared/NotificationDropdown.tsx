 
import { Check, X } from 'lucide-react';
import { INotification } from '../../../types/notificationTypes';
import { useState } from 'react';
import { markAllNotificationsAsRead, markNotificationAsRead } from '../../../api';
import { handleApiError } from '../../../utils/errors/errorHandler';

interface NotificationDropdownProps {
  isOpen: boolean;
  notifications: INotification[];
  setNotifications: React.Dispatch<React.SetStateAction<INotification[]>>;
  onClose: () => void;
   
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ 
  isOpen, 
  notifications, 
  setNotifications, 
  onClose, 
  
}) => {
  const [filter, setFilter] = useState<"all" | "unread">("unread");
  const [markingAsRead, setMarkingAsRead] = useState<Set<string>>(new Set());

  const handleMarkAsRead = async (notificationId: string) => {
    if (markingAsRead.has(notificationId)) return;
    setMarkingAsRead(prev => new Set(prev).add(notificationId));
    
    try {
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      await markNotificationAsRead(notificationId);
    } catch (error) {
      handleApiError(error)
      
      // Revert the optimistic update on error
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: false } : notif
        )
      );
    } finally {
      setMarkingAsRead(prev => {
        const next = new Set(prev);
        next.delete(notificationId);
        return next;
      });
    }
  };

  const onMarkAllAsRead = async() => {
    try {
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
    );
    await markAllNotificationsAsRead()
    } catch (error) {
      handleApiError(error)
    }
  }


  if (!isOpen) return null;

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  return (
    <div className="absolute right-0 mt-2 w-[400px] bg-white rounded-xl shadow-xl z-50 p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-lg font-semibold">Notifications</h4>
        <button onClick={onClose}>
          <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button
            className={`text-sm font-medium px-3 py-1 rounded-full ${
              filter === "unread" ? "bg-gray-800 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter("unread")}
          >
            Unread
          </button>
          <button
            className={`text-sm font-medium px-3 py-1 rounded-full ${
              filter === "all" ? "bg-gray-800 text-white" : "hover:bg-gray-100 bg-gray-200"
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
        </div>
        <button
          onClick={onMarkAllAsRead}
          className="text-sm text-blue-600 hover:underline"
        >
          Mark all as read
        </button>
      </div>

      <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif, idx) => (
            <div
              key={notif._id || idx} // Use _id as key for better React reconciliation
              className="border border-gray-200 rounded-lg p-3 bg-gray-50 relative"
            >
              <div className="text-base font-semibold text-gray-800">
                {notif.type}
              </div>
              <div className="text-sm text-gray-700 mt-1">{notif.message}</div>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span>
                  {new Date(notif.createdAt).toLocaleDateString("en-GB")}{" "}
                  {new Date(notif.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {!notif.isRead && (
                  <button
                    title="Mark as read"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsRead(notif._id);
                    }}
                    disabled={markingAsRead.has(notif._id)}
                    className={`hover:scale-110 transition-transform ${
                      markingAsRead.has(notif._id) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Check className="w-4 h-4 text-green-500 cursor-pointer" />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-sm text-gray-400">
            No {filter} notifications
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
