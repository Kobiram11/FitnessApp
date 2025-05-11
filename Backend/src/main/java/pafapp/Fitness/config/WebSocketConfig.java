package pafapp.Fitness.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue"); // ✅ Include both public & private
        config.setApplicationDestinationPrefixes("/app"); // For @MessageMapping methods
        config.setUserDestinationPrefix("/user"); // ✅ Enables /user/queue support
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws") // Client connects to ws://localhost:8080/ws
                .setAllowedOriginPatterns("*")
                .withSockJS(); // ✅ SockJS fallback
    }
}
