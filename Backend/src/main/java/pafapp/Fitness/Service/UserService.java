package pafapp.Fitness.Service;

import java.util.List;

import org.springframework.http.ResponseEntity;

import pafapp.Fitness.Dto.UserDto;
import pafapp.Fitness.Model.User;

public interface UserService {

    ResponseEntity<Object> createUser(User user);
    UserDto getUserById(String userId);
    List<UserDto> getAllUsers();
    ResponseEntity<Object> followUser(String userId, String followedUserId);

    ResponseEntity<Object> loginUser(String email, String password);

    User getUserByEmail(String email);
    User getUserByIdRaw(String userId);
    public int getPostCountByUserId(String userId);


    
}