package ru.mycrg.gis.security;

import org.jetbrains.annotations.NotNull;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import ru.mycrg.gis.exceptions.ForbiddenException;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Map;
import java.util.Optional;

public class CrgClaimsParser {

    private static final String CLAIM_ORGANIZATIONS = "organizations";

    @NotNull
    public static Long getOrganizationId(Principal principal) {
        long orgId = 0;

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

    private static Optional<Object> getValue(Map<String, Object> first, String target) {
        for (Map.Entry<String, Object> e : first.entrySet()) {
            if (target.equals(e.getKey())) {
                return Optional.of(e.getValue());
            }
        }

        return Optional.empty();
    }

}
