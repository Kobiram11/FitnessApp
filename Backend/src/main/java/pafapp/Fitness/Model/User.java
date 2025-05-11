package pafapp.Fitness.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    private String name;
    private String email;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String profileImage;
    
    private String mobileNumber;
    private String password;
    
    @Enumerated(EnumType.STRING)
    private RegistrationSource source;
    
    private int followersCount;
    private int followingCount;
    
    @ElementCollection
    private List<String> followedUsers;
    
    @ElementCollection
    private List<String> followingUsers;
}