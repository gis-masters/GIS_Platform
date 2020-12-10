package ru.mycrg.auth_service.security;

import lombok.extern.log4j.Log4j2;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.common.DefaultOAuth2AccessToken;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.auth_service.dto.IdNameProjection;
import ru.mycrg.auth_service.entity.User;
import ru.mycrg.auth_service.exeptions.AuthServiceException;
import ru.mycrg.auth_service.repository.UserRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Log4j2
public class CustomTokenConverter extends JwtAccessTokenConverter {

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2Authentication extractAuthentication(Map<String, ?> claims) {
        OAuth2Authentication authentication = super.extractAuthentication(claims);
        authentication.setDetails(claims);

        return authentication;
    }

    @Override
    @Transactional
    public OAuth2AccessToken enhance(OAuth2AccessToken accessToken, OAuth2Authentication authentication) {
        try {
            // Add to token additional info
            ((DefaultOAuth2AccessToken) accessToken).setAdditionalInformation(collectAdditionalInfo(authentication.getName()));

            accessToken = super.enhance(accessToken, authentication);

            // But return token without additionalInformation
            ((DefaultOAuth2AccessToken) accessToken).setAdditionalInformation(new HashMap<>());

             return accessToken;
        } catch (Exception e) {
            throw new AuthServiceException("Token converter error");
        }
    }

    @NotNull
    private Map<String, Object> collectAdditionalInfo(String userName) {
        final Map<String, Object> additionalInfo = new HashMap<>();

        Optional<User> byUsername = userRepository.findByLogin(userName);

        if (byUsername.isPresent()) {
            User user = byUsername.get();

            List<IdNameProjection> usersOrganizations = user.getOrganizations().stream()
                    .map(org -> new IdNameProjection(org.getId(), org.getName()))
                    .collect(Collectors.toList());

            List<IdNameProjection> usersGroups = user.getGroups().stream()
                    .map(group -> new IdNameProjection(group.getId(), group.getName()))
                    .collect(Collectors.toList());

            additionalInfo.put("user_id", user.getId());
            additionalInfo.put("groups", usersGroups);
            additionalInfo.put("organizations", usersOrganizations);
        }

        return additionalInfo;
    }
}
