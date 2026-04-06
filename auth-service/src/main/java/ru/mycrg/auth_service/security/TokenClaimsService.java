package ru.mycrg.auth_service.security;

import org.springframework.stereotype.Service;
import ru.mycrg.auth_service.entity.Authorities;
import ru.mycrg.auth_service.entity.Organization;
import ru.mycrg.auth_service.entity.User;
import ru.mycrg.auth_service.exceptions.BadRequestException;
import ru.mycrg.auth_service.exceptions.NotFoundException;
import ru.mycrg.auth_service.service.UserService;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static ru.mycrg.auth_facade.JwtDetails.DIRECT_MINIONS;
import static ru.mycrg.auth_facade.JwtDetails.GROUPS;
import static ru.mycrg.auth_facade.JwtDetails.MINIONS;
import static ru.mycrg.auth_facade.JwtDetails.ORGANIZATIONS;
import static ru.mycrg.auth_facade.JwtDetails.USER_CRG_LOGIN;
import static ru.mycrg.auth_facade.JwtDetails.USER_ID;
import static ru.mycrg.auth_facade.JwtDetails.USER_NAME;
import static ru.mycrg.auth_facade.JwtDetails.VERSION;

@Service
public class TokenClaimsService {

    public static final String AUTHORITIES = "authorities";
    public static final String ORG_ID = "org_id";

    private final UserService userService;

    public TokenClaimsService(UserService userService) {
        this.userService = userService;
    }

    public Map<String, Object> createAccessClaims(String login, Long requestedOrgId) {
        User user = loadUser(login);
        Long orgId = resolveOrganizationId(user, requestedOrgId);

        Map<String, Object> claims = new HashMap<>();
        List<Long> userGroups = user.getGroups().stream()
                                    .map(group -> group.getId())
                                    .collect(Collectors.toList());
        Set<Integer> minions = new java.util.HashSet<>();
        userService.fetchMinions(minions, user.getId(), new HashMap<>());
        Set<Integer> directMinions = userService.fetchDirectMinions(user.getId());
        minions.removeAll(directMinions);

        claims.put(USER_ID, user.getId());
        claims.put(USER_NAME, user.getGeoserverLogin());
        claims.put(USER_CRG_LOGIN, user.getLogin());
        claims.put(GROUPS, userGroups);
        claims.put(MINIONS, new ArrayList<>(minions));
        claims.put(DIRECT_MINIONS, new ArrayList<>(directMinions));
        claims.put(VERSION, user.getVersion());
        claims.put(AUTHORITIES, user.getAuthorities().stream()
                                    .map(Authorities::getAuthority)
                                    .collect(Collectors.toList()));
        if (orgId != null) {
            claims.put(ORG_ID, orgId);
            claims.put(ORGANIZATIONS, List.of(asOrganizationClaim(resolveOrganization(user, orgId).orElseThrow())));
        }

        return claims;
    }

    public Map<String, Object> createRefreshClaims(String login, Long requestedOrgId) {
        User user = loadUser(login);
        Long orgId = resolveOrganizationId(user, requestedOrgId);

        Map<String, Object> claims = new HashMap<>();
        claims.put(USER_CRG_LOGIN, user.getLogin());
        claims.put(USER_NAME, user.getGeoserverLogin());
        if (orgId != null) {
            claims.put(ORG_ID, orgId);
        }

        return claims;
    }

    private User loadUser(String login) {
        return userService.getByLoginIgnoreCase(login)
                          .orElseThrow(() -> new NotFoundException(login));
    }

    private Long resolveOrganizationId(User user, Long requestedOrgId) {
        if (requestedOrgId != null) {
            resolveOrganization(user, requestedOrgId)
                    .orElseThrow(() -> new BadRequestException("Организация не найдена: " + requestedOrgId));

            return requestedOrgId;
        }

        return user.getOrganizations().stream()
                   .map(Organization::getId)
                   .sorted(Comparator.naturalOrder())
                   .findFirst()
                   .orElse(null);
    }

    private Optional<Organization> resolveOrganization(User user, Long requestedOrgId) {
        return user.getOrganizations().stream()
                   .filter(organization -> organization.getId().equals(requestedOrgId))
                   .findFirst();
    }

    private Map<String, Object> asOrganizationClaim(Organization organization) {
        Map<String, Object> claim = new HashMap<>();
        claim.put("id", organization.getId());
        claim.put("name", organization.getName());

        return claim;
    }
}
