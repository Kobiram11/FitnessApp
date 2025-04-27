package pafapp.Fitness.Dto;


import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pafapp.Fitness.Model.ProgressTemplate;


@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProgressUpdateDto {

    private Long id;  // Corrected here from String to Long

    private String userId;

    private ProgressTemplate progressTemplate;

    private String details;

    private Boolean isPrivate;

    private Instant createdAt;

    private Instant updatedAt;
}
