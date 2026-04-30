package ru.mycrg.notification.config;

import jakarta.annotation.Nullable;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
@ConfigurationProperties(prefix = "telegram")
public class TelegramProperties {

    private List<TelegramProfile> profiles = new ArrayList<>();

    // For backward compatibility
    private String token;

    public TelegramProperties() {
        // Required
    }

    public List<TelegramProfile> getProfiles() {
        return profiles;
    }

    public void setProfiles(List<TelegramProfile> profiles) {
        this.profiles = profiles;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    /**
     * Get token by profile name
     *
     * @param profileName name of the profile
     *
     * @return token for the specified profile or default token if profile not found
     */
    @Nullable
    public String getTokenByProfileName(String profileName) {
        if (profileName == null || profileName.isEmpty()) {
            return token; // Return default token for backward compatibility
        }

        Map<String, TelegramProfile> profileMap = profiles
                .stream()
                .collect(Collectors.toMap(TelegramProfile::getName, Function.identity()));

        return Optional.ofNullable(profileMap.get(profileName))
                       .map(TelegramProfile::getToken)
                       .orElse(token); // Fallback to default token
    }

    /**
     * Get message thread ID by profile name
     *
     * @param profileName name of the profile
     *
     * @return message thread ID for the specified profile or null if not set
     */
    @Nullable
    public String getMessageThreadIdByProfileName(String profileName) {
        if (profileName == null || profileName.isEmpty()) {
            return null; // No default message thread ID
        }

        Map<String, TelegramProfile> profileMap = profiles
                .stream()
                .collect(Collectors.toMap(TelegramProfile::getName, Function.identity()));

        return Optional.ofNullable(profileMap.get(profileName))
                       .map(TelegramProfile::getMessageThreadId)
                       .orElse(null);
    }

    public static class TelegramProfile {

        private String name;
        private String token;
        private String messageThreadId;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }
        
        public String getMessageThreadId() {
            return messageThreadId;
        }
        
        public void setMessageThreadId(String messageThreadId) {
            this.messageThreadId = messageThreadId;
        }
    }
}
