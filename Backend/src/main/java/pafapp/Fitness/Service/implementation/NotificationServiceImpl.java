package pafapp.Fitness.Service.implementation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

import org.springframework.messaging.simp.SimpMessagingTemplate; // Added for WebSocket messaging

import pafapp.Fitness.Model.Notification;
import pafapp.Fitness.Model.Post;
import pafapp.Fitness.Dto.NotificationDto; // Added for sending DTO via WebSocket
import pafapp.Fitness.Service.NotificationService;
import pafapp.Fitness.repository.NotificationRepository;
import pafapp.Fitness.repository.PostRepository;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepo;

    @Autowired
    private PostRepository postRepo;

    @Autowired
    private SimpMessagingTemplate messagingTemplate; // Inject SimpMessagingTemplate for WebSocket

    // Utility method to convert Notification entity to NotificationDto
    private NotificationDto convertToDto(Notification notification) {
        NotificationDto dto = new NotificationDto();
        dto.setId(notification.getId());
        dto.setPostId(notification.getPostId());
        dto.setSenderId(notification.getSenderId());
        dto.setMessage(notification.getMessage());
        dto.setRead(notification.isRead()); // Changed to setRead to match NotificationDto field
        dto.setTimestamp(notification.getTimestamp());
        // senderName can be set if needed by fetching user info, omitted here for brevity
        return dto;
    }

    @Override
    public void sendLikeNotification(String senderId, String postId) {
        Post post = postRepo.findById(Long.parseLong(postId)).orElse(null);
        if (post == null || post.getUserId().equals(senderId)) return; // no self-notify

        Notification notification = new Notification();
        notification.setRecipientId(post.getUserId());
        notification.setSenderId(senderId);
        notification.setPostId(postId);
        notification.setMessage("liked your post.");
        notification.setTimestamp(LocalDateTime.now());

        notificationRepo.save(notification);

        // Send notification via WebSocket to recipient
        NotificationDto dto = convertToDto(notification);
        messagingTemplate.convertAndSend("/topic/notifications/" + post.getUserId(), dto); // WebSocket message sent
    }

    @Override
    public void sendCommentNotification(String senderId, String postId, String commentText) {
        Post post = postRepo.findById(Long.parseLong(postId)).orElse(null);
        if (post == null || post.getUserId().equals(senderId)) return;

        Notification notification = new Notification();
        notification.setRecipientId(post.getUserId());
        notification.setSenderId(senderId);
        notification.setPostId(postId);
        notification.setMessage("commented on your post: \"" + commentText + "\"");
        notification.setTimestamp(LocalDateTime.now());

        notificationRepo.save(notification);

        // Send notification via WebSocket to recipient
        NotificationDto dto = convertToDto(notification);
        messagingTemplate.convertAndSendToUser(
                post.getUserId(), "/queue/notifications", dto   
            );       // WebSocket message sent
    }

    @Override
    public List<Notification> getNotificationsForUser(String userId) {
        return notificationRepo.findByRecipientIdOrderByTimestampDesc(userId);
    }

    @Override
    public void markAsRead(String notificationId) {
        Notification notification = notificationRepo.findById(notificationId).orElse(null);
        if (notification != null) {
            notification.setRead(true);
            notificationRepo.save(notification);
        }
    }

    @Override
    public void deleteNotification(String notificationId) {
        notificationRepo.deleteById(notificationId);
    }
    
}
