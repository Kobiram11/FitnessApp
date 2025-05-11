package pafapp.Fitness.Dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class NotificationDto {
    private String id;
    private String postId;
    private String senderId;
    private String senderName;  // NEW
    private String message;
    private boolean read; // Changed from isRead to read to match setter/getter naming convention
    private LocalDateTime timestamp;

}
