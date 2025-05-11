package pafapp.Fitness.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import pafapp.Fitness.Dto.UserDto;
import pafapp.Fitness.Dto.UserResDto;
import pafapp.Fitness.Model.User;
import pafapp.Fitness.Service.UserService;
import pafapp.Fitness.repository.UserRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private UserRepository userRepository;


    @PostMapping("/register")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        try {
            // Add basic validation
            if (user.getEmail() == null || user.getEmail().isEmpty()) {
                return ResponseEntity.badRequest().body("Email is required");
            }
            if (user.getPassword() == null || user.getPassword().isEmpty()) {
                return ResponseEntity.badRequest().body("Password is required");
            }
            
            return userService.createUser(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Registration failed: " + e.getMessage());
        }
    }


    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        try {
            List<UserDto> users = userService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to fetch users: " + e.getMessage());
        }
    }
    
    @PostMapping("/follow")
    public ResponseEntity<Object> followUser(@RequestParam String userId, @RequestParam String FollowedUserId) {
        return userService.followUser(userId,FollowedUserId);

    }
    @PostMapping("/login")
    public ResponseEntity<Object> loginUser(@RequestBody User user, HttpServletRequest request) {
    ResponseEntity<Object> response = userService.loginUser(user.getEmail(), user.getPassword());

    if (response.getStatusCode() == HttpStatus.OK && response.getBody() instanceof UserResDto userDto) {
        request.getSession().setAttribute("userId", userDto.getId());
    }

    return response;
}


    
@GetMapping("/me")
public ResponseEntity<?> getCurrentUser(
        HttpSession session,
        OAuth2AuthenticationToken token
) {
    try {
        User user = null;

        // ✅ If user logged in via OAuth
        if (token != null && token.isAuthenticated()) {
            String email = token.getPrincipal().getAttribute("email");
            user = userService.getUserByEmail(email);
        }

        // ✅ If user logged in with credentials
        if (user == null) {
            String userId = (String) session.getAttribute("userId");
            if (userId != null) {
                user = userService.getUserByIdRaw(userId); // returns User entity
            }
        }

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        // ✅ Prepare minimal response with ID included
        Map<String, Object> data = new HashMap<>();
        data.put("id", user.getId()); // ✅ Added this line
        data.put("username", user.getName());
        data.put("profileImage", user.getProfileImage());

        Map<String, Integer> stats = new HashMap<>();
        int postCount = userService.getPostCountByUserId(user.getId());
        stats.put("posts", postCount);
        stats.put("followers", user.getFollowersCount());
        stats.put("following", user.getFollowingCount());

        data.put("stats", stats);
        return ResponseEntity.ok(data);

    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to retrieve current user: " + e.getMessage());
    }
}


@PutMapping("/{userId}")
public ResponseEntity<?> updateUser(
        @PathVariable String userId,
        @RequestBody Map<String, Object> updates
) {
    try {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        if (updates.containsKey("username")) {
            user.setName((String) updates.get("username"));
        }
        if (updates.containsKey("profileImage")) {
            user.setProfileImage((String) updates.get("profileImage"));
        }

        userRepository.save(user);
        return ResponseEntity.ok("Profile updated successfully");

    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Update failed: " + e.getMessage());
    }
}
    
}
