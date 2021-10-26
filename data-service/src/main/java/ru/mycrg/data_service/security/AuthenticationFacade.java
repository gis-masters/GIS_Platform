package ru.mycrg.data_service.security;

import org.jetbrains.annotations.NotNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.exceptions.ForbiddenException;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;
import java.util.Optional;

import static ru.mycrg.auth_service_contract.Authorities.GLOBAL_ADMIN;
import static ru.mycrg.auth_service_contract.Authorities.ORG_ADMIN;

@Component
public class AuthenticationFacade implements IAuthenticationFacade {

    private static final String CLAIM_USER_ID = "user_id";
    private static final String CLAIM_ORGANIZATIONS = "organizations";
    private static final String CLAIM_GROUPS = "groups";

    public Authentication getAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    @Override
    public String getAccessToken() {
        Authentication authentication = getAuthentication();

        Object details = authentication.getDetails();
        if (details != null) {
            return ((OAuth2AuthenticationDetails) details).getTokenValue();
        } else {
            return "";
        }
    }

    @Override
    public String getLogin() {
        return getAuthentication().getName();
    }

    @Override
    public boolean isRoot() {
        return isUserHasAuthority(getAuthentication(), GLOBAL_ADMIN);
    }

    @Override
    public boolean isOrganizationAdmin() {
        return isUserHasAuthority(getAuthentication(), ORG_ADMIN);
    }

    @Override
    public Long getOrganizationId() {
        Authentication authentication = getAuthentication();

        return extractOrgId(authentication);
    }

    @Override
    public Long getOrganizationId(Authentication authentication) {
        return extractOrgId(authentication);
    }

    @Override
    public UserDetails getUserDetails() {
        try {
            UserDetails userDetails = new UserDetails();
            Map<String, Object> decodedDetails = decode(getAuthentication());

            getValue(decodedDetails, CLAIM_USER_ID)
                    .ifPresent(o -> {
                        userDetails.setUserId(Long.valueOf(String.valueOf(o)));
                    });

            getValue(decodedDetails, CLAIM_GROUPS)
                    .ifPresent(groups -> {
                        ((ArrayList) groups).forEach(data -> {
                            getValue((Map<String, Object>) data, "id")
                                    .ifPresent(o -> {
                                        userDetails.addGroupId(Long.valueOf(String.valueOf(o)));
                                    });
                        });
                    });

            return userDetails;
        } catch (Exception e) {
            throw new ForbiddenException("Не удалось аутентифицировать пользователя: Incorrect group claims");
        }
    }

    @NotNull
    private Long extractOrgId(Authentication authentication) {
        try {
            Map<String, Object> decodedDetails = decode(authentication);

            Optional<Object> oOrganization = getValue(decodedDetails, CLAIM_ORGANIZATIONS);
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

    private static Map<String, Object> decode(Principal principal) {
        var authentication = (OAuth2Authentication) principal;
        var details = (OAuth2AuthenticationDetails) authentication.getDetails();

        return (Map<String, Object>) details.getDecodedDetails();
    }

    private static Optional<Object> getValue(Map<String, Object> data, String target) {
        for (Map.Entry<String, Object> e: data.entrySet()) {
            if (target.equals(e.getKey())) {
                return Optional.of(e.getValue());
            }
        }

        return Optional.empty();
    }

    @NotNull
    private static Boolean isUserHasAuthority(@NotNull Authentication authentication, String authority) {
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();

        return authorities.contains(new SimpleGrantedAuthority(authority));
    }
}
