package pafapp.Fitness.Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class CommentDto {

    private String content;
    private String commentBy;
    private String commentById;
    private String commentByProfile;
    
}
