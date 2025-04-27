package pafapp.Fitness.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "progress_updates")
public class ProgressUpdate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;

    @Enumerated(EnumType.STRING)
    private ProgressTemplate progressTemplate;

    @Column(columnDefinition = "TEXT")
    private String details;

    private Boolean isPrivate = false;

    @Column(updatable = false)
    private Instant createdAt;

    private Instant updatedAt;

    public ProgressUpdate() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    @PreUpdate
    public void updateTimestamp() {
        this.updatedAt = Instant.now();
    }
}