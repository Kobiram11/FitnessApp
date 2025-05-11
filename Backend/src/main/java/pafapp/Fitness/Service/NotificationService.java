package pafapp.Fitness.Service;

import java.util.List;

import pafapp.Fitness.Model.Notification;

public interface NotificationService {
    void sendLikeNotification(String senderId, String postId);
    void sendCommentNotification(String senderId, String postId, String commentText);
    List<Notification> getNotificationsForUser(String userId);
    void markAsRead(String notificationId);
    void deleteNotification(String notificationId);
}

