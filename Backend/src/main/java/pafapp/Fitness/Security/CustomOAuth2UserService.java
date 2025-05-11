package pafapp.Fitness.Security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.stereotype.Service;

import pafapp.Fitness.Model.User;
import pafapp.Fitness.Model.RegistrationSource;
import pafapp.Fitness.repository.UserRepository;

import java.util.ArrayList;

@Service
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User oauthUser = new DefaultOAuth2UserService().loadUser(userRequest);
        
        String email = oauthUser.getAttribute("email");
        if (email == null || email.isEmpty()) {
            throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
        }

        String name = oauthUser.getAttribute("name");
        String picture = oauthUser.getAttribute("picture");

        User user = userRepository.findByEmail(email);

        if (user == null) {
            // New user registration
            user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setProfileImage(picture);
            user.setSource(RegistrationSource.GOOGLE);
            user.setFollowedUsers(new ArrayList<>());
            user.setFollowingUsers(new ArrayList<>());
            user.setFollowersCount(0);
            user.setFollowingCount(0);
            userRepository.save(user);
        } else if (user.getSource() != RegistrationSource.GOOGLE) {
            // Existing user but not registered via Google
            throw new OAuth2AuthenticationException(
                "Email already registered with " + user.getSource() + 
                ". Please login with your original method.");
        }
        // For existing Google users, no action needed

        return oauthUser;
    }
}
