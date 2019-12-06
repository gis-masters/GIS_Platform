package ru.mycrg.auth_service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.common.DefaultOAuth2AccessToken;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.auth_service.dto.IdNameProjection;
import ru.mycrg.auth_service.entity.User;
import ru.mycrg.auth_service.repository.UserRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

public class CustomTokenConverter extends JwtAccessTokenConverter {

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public OAuth2AccessToken enhance(OAuth2AccessToken accessToken, OAuth2Authentication authentication) {
        if (authentication.getOAuth2Request().getGrantType().equalsIgnoreCase("password")) {
            String userName = authentication.getName();

            Optional<User> byUsername = userRepository.findByUsername(userName);

            final Map<String, Object> additionalInfo = new HashMap<>();
            if (byUsername.isPresent()) {
                User user = byUsername.get();

                List<IdNameProjection> usersOrganizations = user.getOrganizations().stream()
                        .map(org -> new IdNameProjection(org.getId(), org.getName()))
                        .collect(Collectors.toList());

                additionalInfo.put("userId", user.getId());
                additionalInfo.put("userName", user.getUsername());
                additionalInfo.put("organizations", usersOrganizations);
            }

            ((DefaultOAuth2AccessToken) accessToken).setAdditionalInformation(additionalInfo);
        }

        accessToken = super.enhance(accessToken, authentication);

        ((DefaultOAuth2AccessToken) accessToken).setAdditionalInformation(new HashMap<>());

        return accessToken;
    }
}
