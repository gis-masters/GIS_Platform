package ru.mycrg.auth_facade;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static ru.mycrg.auth_facade.JwtDetails.*;
import static ru.mycrg.auth_service_contract.Authorities.ORG_ADMIN;
import static ru.mycrg.auth_service_contract.Authorities.SYSTEM_ADMIN;

public class AuthenticationFacade implements IAuthenticationFacade {

    private static final Logger log = LoggerFactory.getLogger(AuthenticationFacade.class);

    @Override
    public String getAccessToken() {
        return extractTokenValue(getAuthentication()).orElse("");
    }

    @Override
    public String getLogin() {
        return getUserDetails().getCrgLogin();
    }

    @Override
    public String getGeoserverLogin() {
        return getAuthentication().getName();
    }

    @Override
    public boolean isRoot() {
        return isUserHasAuthority(getAuthentication(), SYSTEM_ADMIN);
    }

    @Override
    public boolean isOrganizationAdmin() {
        return isUserHasAuthority(getAuthentication(), ORG_ADMIN);
    }

    @Override
    public Long getOrganizationId() {
        return extractOrgId(getAuthentication());
    }

    @Override
    public Long getOrganizationId(Authentication authentication) {
        return extractOrgId(authentication);
    }

    @Override
    public UserDetails getUserDetails() {
        UserDetails userDetails = new UserDetails();
        Map<String, Object> decodedDetails = decode(getAuthentication());

        getValue(decodedDetails, USER_ID)
                .ifPresent(o -> {
                    userDetails.setUserId(Long.valueOf(String.valueOf(o)));
                });

        getValue(decodedDetails, USER_CRG_LOGIN)
                .ifPresent(o -> {
                    userDetails.setCrgLogin(String.valueOf(o));
                });

        getValue(decodedDetails, VERSION)
                .ifPresent(o -> {
                    userDetails.setVersion(Short.valueOf(String.valueOf(o)));
                });

        getValue(decodedDetails, GROUPS)
                .ifPresent(groups -> {
                    ((List) groups).forEach(id -> userDetails.addGroupId(Long.valueOf(String.valueOf(id))));
                });

        getValue(decodedDetails, MINIONS)
                .ifPresent(minions -> {
                    ((List) minions).forEach(id -> userDetails.addMinionId(Long.valueOf(String.valueOf(id))));
                });

        getValue(decodedDetails, DIRECT_MINIONS)
                .ifPresent(minions -> {
                    ((List) minions).forEach(id -> userDetails.addDirectMinionId(Long.valueOf(String.valueOf(id))));
                });

        return userDetails;
    }

    @NotNull
    private Long extractOrgId(Authentication authentication) {
        try {
            Map<String, Object> decodedDetails = decode(authentication);

            Optional<Object> oOrganization = getValue(decodedDetails, ORGANIZATIONS);
            if (oOrganization.isPresent()) {
                Map<String, Object> firstOrg = (Map<String, Object>) ((ArrayList) oOrganization.get()).get(0);
                Optional<Object> oValue = getValue(firstOrg, "id");

                return oValue.map(this::toLong).orElse(-1L);
            } else {
                return -1L;
            }
        } catch (Exception e) {
            return -1L;
        }
    }

    private Map<String, Object> decode(Principal principal) {
        try {
            if (!(principal instanceof Authentication authentication)) {
                return Collections.emptyMap();
            }

            Object details = authentication.getDetails();
            if (details instanceof OAuth2AuthenticationDetails oAuth2Details) {
                Object decodedDetails = oAuth2Details.getDecodedDetails();
                if (decodedDetails instanceof Map<?, ?> map) {
                    return asStringMap(map);
                }
            }
            if (details instanceof JwtAuthenticationDetails jwtDetails) {
                return jwtDetails.getDecodedDetails();
            }
            if (details instanceof Map<?, ?> map) {
                return asStringMap(map);
            }
        } catch (Exception e) {
            log.error("Не удалось прочесть Principal => {}", e.getMessage(), e);
        }

        return new HashMap<>();
    }

    private Optional<Object> getValue(Map<String, Object> data, String target) {
        for (Map.Entry<String, Object> e: data.entrySet()) {
            if (target.equals(e.getKey())) {
                return Optional.ofNullable(e.getValue());
            }
        }

        return Optional.empty();
    }

    @NotNull
    private Boolean isUserHasAuthority(@NotNull Authentication authentication, String authority) {
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();

        return authorities.contains(new SimpleGrantedAuthority(authority));
    }

    private Authentication getAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    private Optional<String> extractTokenValue(Authentication authentication) {
        if (authentication == null) {
            return Optional.empty();
        }

        Object details = authentication.getDetails();
        if (details instanceof OAuth2AuthenticationDetails oAuth2Details) {
            return Optional.ofNullable(oAuth2Details.getTokenValue());
        }
        if (details instanceof JwtAuthenticationDetails jwtDetails) {
            return Optional.ofNullable(jwtDetails.getTokenValue());
        }

        return Optional.empty();
    }

    private Map<String, Object> asStringMap(Map<?, ?> source) {
        Map<String, Object> result = new HashMap<>();
        source.forEach((key, value) -> result.put(String.valueOf(key), value));

        return result;
    }

    private Long toLong(Object value) {
        if (value instanceof Number number) {
            return number.longValue();
        }

        return Long.valueOf(String.valueOf(value));
    }
}
