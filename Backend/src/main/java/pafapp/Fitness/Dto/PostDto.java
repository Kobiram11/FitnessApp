package pafapp.Fitness.Dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class PostDto {
    private Long id;
    private String title;
    private LocalDateTime date;
    private List<String> images;
    private String video;
    private String description;

    private int likeCount;
    private int commentsCount;

    private String userId;
    private String username;
    
    private String userProfile;
}
