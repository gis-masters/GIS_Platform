package ru.mycrg.data_service.security;

import org.jetbrains.annotations.NotNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import ru.mycrg.data_service.config.Authorities;
import ru.mycrg.data_service.exceptions.ForbiddenException;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;
import java.util.Optional;

public class CrgClaimsParser {

    private static final String CLAIM_USER_ID = "user_id";
    private static final String CLAIM_ORGANIZATIONS = "organizations";
    private static final String CLAIM_GROUPS = "groups";

    public static boolean isRoot(Authentication authentication) {
        return isUserHasAuthority(authentication, Authorities.GLOBAL_ADMIN);
    }

    private static boolean isUserHasAuthority(Authentication authentication, String authority) {
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();

        return authorities.contains(new SimpleGrantedAuthority(authority));
    }

    @NotNull
    public static Long getOrganizationId(Principal principal) {
        long orgId = 0;

        try {
            Map<String, Object> decodedDetails = decode(principal);

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

    @NotNull
    public static UserDetails getUserDetails(Principal principal) {
        UserDetails userDetails = new UserDetails();

        try {
            Map<String, Object> decodedDetails = decode(principal);

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
        } catch (Exception e) {
            throw new ForbiddenException("Incorrect group claims");
        }

        return userDetails;
    }

    private static Map<String, Object> decode(Principal principal) {
        var authentication = (OAuth2Authentication) principal;
        var details = (OAuth2AuthenticationDetails) authentication.getDetails();

        return (Map<String, Object>) details.getDecodedDetails();
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
