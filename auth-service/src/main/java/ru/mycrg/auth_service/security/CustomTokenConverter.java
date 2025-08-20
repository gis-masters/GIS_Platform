package ru.mycrg.auth_service.security;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.oauth2.common.DefaultOAuth2AccessToken;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.auth_service.entity.Group;
import ru.mycrg.auth_service.entity.User;
import ru.mycrg.auth_service.exceptions.AuthServiceException;
import ru.mycrg.auth_service.exceptions.BadRequestException;
import ru.mycrg.auth_service.service.UserService;
import ru.mycrg.auth_service_contract.dto.IdNameProjection;

import java.util.*;
import java.util.stream.Collectors;

import static ru.mycrg.auth_facade.JwtDetails.*;

public class CustomTokenConverter extends JwtAccessTokenConverter {

    private final Logger log = LoggerFactory.getLogger(CustomTokenConverter.class);

    private final UserService userService;

    public CustomTokenConverter(UserService userService) {
        this.userService = userService;
    }

    @Override
    public OAuth2Authentication extractAuthentication(Map<String, ?> claims) {
        OAuth2Authentication authentication = super.extractAuthentication(claims);
        authentication.setDetails(claims);

        return authentication;
    }

    @Override
    @Transactional
    public OAuth2AccessToken enhance(OAuth2AccessToken accessToken, OAuth2Authentication authentication) {
        Long requiredOrgId = null;
        try {
            String orgId = authentication.getOAuth2Request().getRequestParameters().get("orgId");

            log.trace("enhance the token with organization info: {}", orgId);
            if (orgId != null && !orgId.isBlank()) {
                requiredOrgId = Long.valueOf(orgId);
            }

            // Add to token additional info
            ((DefaultOAuth2AccessToken) accessToken).setAdditionalInformation(
                    collectAdditionalInfo(authentication.getName(), requiredOrgId));

            accessToken = super.enhance(accessToken, authentication);

            // But return token without additionalInformation
            ((DefaultOAuth2AccessToken) accessToken).setAdditionalInformation(new HashMap<>());

            return accessToken;
        } catch (Exception e) {
            throw new AuthServiceException("Token converter error. Reason: " + e.getMessage());
        }
    }

    @NotNull
    private Map<String, Object> collectAdditionalInfo(String userName, Long orgId) {
        Map<String, Object> additionalInfo = new HashMap<>();

        Optional<User> byUsername = userService.getByLoginIgnoreCase(userName);
        if (byUsername.isPresent()) {
            User user = byUsername.get();

            List<Long> usersGroups = user.getGroups().stream()
                                         .map(Group::getId)
                                         .collect(Collectors.toList());

            Set<Integer> minions = new HashSet<>();
            userService.fetchMinions(minions, user.getId(), new HashMap<>());
            Set<Integer> directMinions = userService.fetchDirectMinions(user.getId());
            minions.removeAll(directMinions);

            additionalInfo.put(USER_ID, user.getId());
            additionalInfo.put(USER_NAME, user.getGeoserverLogin());
            additionalInfo.put(USER_CRG_LOGIN, user.getLogin());
            additionalInfo.put(GROUPS, usersGroups);
            additionalInfo.put(MINIONS, minions);
            additionalInfo.put(DIRECT_MINIONS, directMinions);
            additionalInfo.put(VERSION, user.getVersion());
            Optional<IdNameProjection> oOrganization;
            if (orgId == null) {
                oOrganization = user.getOrganizations().stream()
                                    .sorted((o1, o2) -> (int) (o1.getId() - o2.getId()))
                                    .map(org -> new IdNameProjection(org.getId(), org.getName()))
                                    .findFirst();
            } else {
                oOrganization = user.getOrganizations().stream()
                                    .filter(organization -> organization.getId().equals(orgId))
                                    .map(org -> new IdNameProjection(org.getId(), org.getName()))
                                    .findFirst();

                if (oOrganization.isEmpty()) {
                    throw new BadRequestException("Организация не найдена: " + orgId);
                }
            }

            oOrganization.ifPresent(org -> {
                additionalInfo.put(ORGANIZATIONS, List.of(org));
            });
        }

        return additionalInfo;
    }
}
