package pafapp.Fitness.Dto;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Lob;
import lombok.Data;


@Data
public class UserDto {

    private String id;
    private String name;
    private String email;
    private String profileImage;
    private String mobileNumber;
    private String source;
    private List<String> followedUsers;
    private List<String> followingUsers;
    private int followersCount;
    private int followingCount;
    
}
