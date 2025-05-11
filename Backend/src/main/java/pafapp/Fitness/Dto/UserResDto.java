package pafapp.Fitness.Dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import pafapp.Fitness.Model.RegistrationSource;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserResDto {
        private String id;

    private String name;

    private String email;

    private String profileImage;

    private RegistrationSource source;

    private List<String> followedUsers;
}
