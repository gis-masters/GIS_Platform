package ru.mycrg.auth_service.security;

import org.jetbrains.annotations.NotNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import ru.mycrg.auth_service.exceptions.ForbiddenException;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;
import java.util.Optional;

import static ru.mycrg.auth_service.service.AuthorityService.GLOBAL_ADMIN;
import static ru.mycrg.auth_service.service.AuthorityService.ORG_ADMIN;

public class CrgClaimsParser {

    private static final String CLAIM_ORGANIZATIONS = "organizations";

    public static boolean isRoot(Authentication authentication) {
        return isUserHasAuthority(authentication, GLOBAL_ADMIN);
    }

    public static boolean isGeoserverAdmin(Authentication authentication) {
        return isUserHasAuthority(authentication, ORG_ADMIN);
    }

    private static boolean isUserHasAuthority(Authentication authentication, String authority) {
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();

        return authorities.contains(new SimpleGrantedAuthority(authority));
    }

    @NotNull
    public static String getToken(@NotNull Authentication authentication) {
        OAuth2AuthenticationDetails details = (OAuth2AuthenticationDetails) authentication.getDetails();
        if (details != null) {
            return details.getTokenValue();
        } else {
            return "";
        }
    }

    @NotNull
    public static Long getOrganizationId(Principal principal) {
        long orgId = -1;

        try {
            Object details = ((OAuth2Authentication) principal).getDetails();
            Map<String, Object> decodedDetails =
                    (Map<String, Object>) ((OAuth2AuthenticationDetails) details).getDecodedDetails();

            Optional<Object> oOrganization = getValue(decodedDetails, CLAIM_ORGANIZATIONS);
            if (oOrganization.isPresent()) {
                Map<String, Object> firstOrg = (Map<String, Object>) ((ArrayList) oOrganization.get()).get(0);
                Optional<Object> oValue = getValue(firstOrg, "id");
                if (oValue.isPresent()) {
                    orgId = ((Integer) oValue.get()).longValue();
                }
            }
        } catch (Exception e) {
            throw new ForbiddenException("Incorrect organization claims");
        }

        return orgId;
    }

    private static Optional<Object> getValue(Map<String, Object> data, String target) {
        for (Map.Entry<String, Object> e : data.entrySet()) {
            if (target.equals(e.getKey())) {
                return Optional.of(e.getValue());
            }
        }

        return Optional.empty();
    }

}
