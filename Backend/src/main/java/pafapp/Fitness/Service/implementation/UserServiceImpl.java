package pafapp.Fitness.Service.implementation;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import pafapp.Fitness.Dto.UserDto;
import pafapp.Fitness.Dto.UserResDto;
import pafapp.Fitness.Model.RegistrationSource;
import pafapp.Fitness.Model.User;
import pafapp.Fitness.Service.UserService;
import pafapp.Fitness.repository.PostRepository;
import pafapp.Fitness.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PostRepository postRepository;

    @Override
public ResponseEntity<Object> createUser(User user) {
    try {
        // Ensure it's a credentials-based registration
        if (user.getSource() != RegistrationSource.CREDENTIAL) {
            return ResponseEntity.badRequest().body("Invalid registration source for this method.");
        }

        // Check if email is already used
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("User already exists with this email.");
        }

        // Prepare user details
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setFollowedUsers(user.getFollowedUsers() != null ? user.getFollowedUsers() : new ArrayList<>());
        user.setFollowingUsers(user.getFollowingUsers() != null ? user.getFollowingUsers() : new ArrayList<>());
        user.setFollowersCount(user.getFollowersCount() >= 0 ? user.getFollowersCount() : 0);
        user.setFollowingCount(user.getFollowingCount() >= 0 ? user.getFollowingCount() : 0);

        User savedUser = userRepository.save(user);
        return ResponseEntity.ok("Registered successfully");

    } catch (DataIntegrityViolationException e) {
        return ResponseEntity.internalServerError().body("Database error: " + e.getMessage());
    } catch (Exception e) {
        return ResponseEntity.internalServerError().body("Registration failed: " + e.getMessage());
    }
}



    @Override
    public UserDto getUserById(String userId) {
        return userRepository.findById(userId)
                .map(user -> {
                    UserDto userDTO = new UserDto();
                    BeanUtils.copyProperties(user, userDTO);
                    return userDTO;
                })
                .orElse(null);
    }

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> {
                    UserDto userDTO = new UserDto();
                    BeanUtils.copyProperties(user, userDTO);
                    return userDTO;
                })
                .collect(Collectors.toList());
    }

    @Override
    public ResponseEntity<Object> followUser(String userId, String followedUserId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with id " + userId));
            User followUser = userRepository.findById(followedUserId)
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + followedUserId));

            if (user.getFollowedUsers() == null) {
                user.setFollowedUsers(new ArrayList<>());
            }
            if (followUser.getFollowingUsers() == null) {
                followUser.setFollowingUsers(new ArrayList<>());
            }

            if (user.getFollowedUsers().contains(followedUserId)) {
                user.getFollowedUsers().remove(followedUserId);
                followUser.getFollowingUsers().remove(userId);
                user.setFollowersCount(user.getFollowersCount() - 1);
                followUser.setFollowingCount(followUser.getFollowingCount() - 1);
            } else {
                user.getFollowedUsers().add(followedUserId);
                followUser.getFollowingUsers().add(userId);
                user.setFollowersCount(user.getFollowersCount() + 1);
                followUser.setFollowingCount(followUser.getFollowingCount() + 1);
            }
            userRepository.save(user);
            userRepository.save(followUser);
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public User getUserByEmail(String email) {
    return userRepository.findByEmail(email);
    }

    @Override
    public User getUserByIdRaw(String userId) {
        return userRepository.findById(userId).orElse(null);
    }


    @Override
    public ResponseEntity<Object> loginUser(String email, String password) {
        try {
            // Input validation
            if (email == null || email.isBlank() || password == null || password.isBlank()) {
                return new ResponseEntity<>("Email and password are required", HttpStatus.BAD_REQUEST);
            }
    
            // Check if user exists
            User user = userRepository.findByEmail(email);
            if (user == null) {
                return new ResponseEntity<>("Invalid password or email", HttpStatus.UNAUTHORIZED);
            }
    
            // Restrict to credentials-based login
            if (user.getSource() != RegistrationSource.CREDENTIAL) {
                return new ResponseEntity<>("Use OAuth login for this account", HttpStatus.UNAUTHORIZED);
            }
    
            // Validate password
            if (passwordEncoder.matches(password, user.getPassword())) {
                UserResDto userDto = new UserResDto();
                BeanUtils.copyProperties(user, userDto);
                return new ResponseEntity<>(userDto, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Invalid password or email", HttpStatus.UNAUTHORIZED);
            }
    
        } catch (Exception e) {
            return new ResponseEntity<>("Login failed: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

        @Override
    public int getPostCountByUserId(String userId) {
        return postRepository.countByUserId(userId);
    }
        
}
