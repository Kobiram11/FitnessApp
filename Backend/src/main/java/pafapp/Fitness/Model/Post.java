package pafapp.Fitness.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    private String username;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String userProfile;

    private String title;
    private String description;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "post_images", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "images", columnDefinition = "TEXT")
    private List<String> images;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String video;

    @CreatedDate
    private LocalDateTime date;

    private int likeCount;

    private int commentsCount; // ✅ ADD THIS FIELD

    @ElementCollection(fetch = FetchType.LAZY)
    private List<String> likedBy = new ArrayList<>();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Comment> comments = new ArrayList<>();

    @ElementCollection(fetch = FetchType.LAZY)
    private List<String> sharedBy = new ArrayList<>();

    // 👍 Utility methods
    public void addLikedBy(String userId) {
        likedBy.add(userId);
        likeCount = likedBy.size();
    }

    public void removeLikedBy(String userId) {
        likedBy.remove(userId);
        likeCount = likedBy.size();
    }
}
