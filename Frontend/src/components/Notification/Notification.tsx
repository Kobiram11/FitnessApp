import {
  Popover,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import {
  Delete,
  Favorite,
  Comment,
  PersonAdd,
  FitnessCenter,
  NotificationsActive,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import {
  fetchNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "../../api/api";
import {
  connectToNotificationSocket,
  disconnectSocket,
} from "../../utils/notificationSocket";

interface NotificationItem {
  id: string;
  senderId: string;
  message: string;
  postId: string;
  timestamp: string;
  read: boolean;
}

interface Props {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  userId: string;
  setUnreadCount: (count: number) => void;
}

export default function Notification({
  anchorEl,
  open,
  onClose,
  userId,
  setUnreadCount,
}: Props) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const loadNotifications = async () => {
    if (!userId || userId.trim() === "") {
      console.warn("🚫 Skipping fetchNotifications: userId is missing or empty.");
      return;
    }

    try {
      const data: NotificationItem[] = await fetchNotifications(userId);
      setNotifications(data);
      const unread = data.filter((n) => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("❌ Failed to fetch notifications:", error);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      loadNotifications();
    } catch (err) {
      console.error("❌ Failed to mark as read:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      const updated = notifications.filter((n) => n.id !== id);
      setNotifications(updated);
      setUnreadCount(updated.filter((n) => !n.read).length);
    } catch (err) {
      console.error("❌ Failed to delete:", err);
    }
  };

  const getIcon = (msg: string) => {
    if (msg.includes("liked")) return <Favorite color="error" />;
    if (msg.includes("commented")) return <Comment color="primary" />;
    if (msg.includes("followed")) return <PersonAdd color="success" />;
    if (msg.includes("workout")) return <FitnessCenter color="secondary" />;
    return <NotificationsActive color="action" />;
  };

  useEffect(() => {
    if (!open || !userId) return;

    console.log("🔍 Notification userId:", userId);
    loadNotifications();

    connectToNotificationSocket(userId, (newNotification: NotificationItem) => {
      setNotifications((prev) => {
        const updated = [newNotification, ...prev];
        setUnreadCount(updated.filter((n) => !n.read).length);
        return updated;
      });
    });

    return () => {
      disconnectSocket();
    };
  }, [open, userId]);

  return (
    <Popover
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      PaperProps={{
        sx: {
          zIndex: 2000,
          width: 350,
          maxHeight: 500,
          overflowY: "auto",
          borderRadius: 2,
          p: 1,
        },
      }}
    >
      <List>
        {notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography color="text.secondary">No notifications</Typography>
          </Box>
        ) : (
          notifications.map((notification, index) => (
            <Box key={notification.id}>
              {index > 0 && <Divider />}
              <ListItem
                alignItems="flex-start"
                sx={{
                  bgcolor: notification.read ? "#fff" : "#f0f8ff",
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <ListItemAvatar>
                  <Avatar>{getIcon(notification.message)}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" fontWeight="bold">
                      {notification.message}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(notification.timestamp).toLocaleString()}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          disabled={notification.read}
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          {notification.read ? "Read" : "Mark as Read"}
                        </Button>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(notification.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </>
                  }
                />
              </ListItem>
            </Box>
          ))
        )}
      </List>
    </Popover>
  );
}
