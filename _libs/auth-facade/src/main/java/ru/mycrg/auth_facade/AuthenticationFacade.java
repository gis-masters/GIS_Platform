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
import java.util.*;

import static ru.mycrg.auth_facade.JwtDetails.*;
import static ru.mycrg.auth_service_contract.Authorities.ORG_ADMIN;
import static ru.mycrg.auth_service_contract.Authorities.SYSTEM_ADMIN;

public class AuthenticationFacade implements IAuthenticationFacade {

    private static final Logger log = LoggerFactory.getLogger(AuthenticationFacade.class);

    @Override
    public String getAccessToken() {
        Object details = getAuthentication().getDetails();
        if (details != null) {
            return ((OAuth2AuthenticationDetails) details).getTokenValue();
        } else {
            return "";
        }
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

                return oValue.map(o -> ((Integer) o).longValue()).orElse(-1L);
            } else {
                return -1L;
            }
        } catch (Exception e) {
            return -1L;
        }
    }

    private Map<String, Object> decode(Principal principal) {
        try {
            OAuth2Authentication authentication = (OAuth2Authentication) principal;
            OAuth2AuthenticationDetails details = (OAuth2AuthenticationDetails) authentication.getDetails();

            return (Map<String, Object>) details.getDecodedDetails();
        } catch (Exception e) {
            log.error("Не удалось прочесть Principal => {}", e.getMessage(), e);

            return new HashMap<>();
        }
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
}
