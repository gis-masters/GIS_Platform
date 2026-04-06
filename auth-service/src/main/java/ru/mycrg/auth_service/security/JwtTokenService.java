package ru.mycrg.auth_service.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service.entity.User;
import ru.mycrg.auth_service.service.UserService;
import ru.mycrg.jwt_support.JwtClaimNames;
import ru.mycrg.jwt_support.JwtClaimsDecoder;
import ru.mycrg.jwt_support.JwtTokenEncoder;
import ru.mycrg.jwt_support.JwtTokenKinds;
import ru.mycrg.oauth_client.JwtToken;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

import static ru.mycrg.auth_facade.JwtDetails.USER_CRG_LOGIN;
import static ru.mycrg.auth_facade.JwtDetails.USER_NAME;
import static ru.mycrg.auth_service.security.TokenClaimsService.ORG_ID;

@Service
public class JwtTokenService {

    private static final String SCOPE = "scope";
    private static final String SCOPE_VALUE = "crg";
    private static final String TOKEN_TYPE = "bearer";

    private final JwtClaimsDecoder jwtClaimsDecoder = new JwtClaimsDecoder();
    private final JwtTokenEncoder jwtTokenEncoder = new JwtTokenEncoder();
    private final AuthenticationManager authenticationManager;
    private final TokenClaimsService tokenClaimsService;
    private final UserService userService;
    private final String secret;
    private final Integer accessTokenValidityTime;
    private final Integer refreshTokenValidityTime;

    public JwtTokenService(AuthenticationManager authenticationManager,
                           TokenClaimsService tokenClaimsService,
                           UserService userService,
                           @Value("${security.jwt.secret}") String secret,
                           @Value("#{ '${security.jwt.access_token_validity_seconds}'.isEmpty() " +
                                   "? 86400 : '${security.jwt.access_token_validity_seconds}' }")
                           Integer accessTokenValidityTime,
                           @Value("#{ '${security.jwt.refresh_token_validity_seconds}'.isEmpty() " +
                                   "? 1209600 : '${security.jwt.refresh_token_validity_seconds}' }")
                           Integer refreshTokenValidityTime) {
        this.authenticationManager = authenticationManager;
        this.tokenClaimsService = tokenClaimsService;
        this.userService = userService;
        this.secret = secret;
        this.accessTokenValidityTime = accessTokenValidityTime;
        this.refreshTokenValidityTime = refreshTokenValidityTime;
    }

    public JwtToken issuePasswordToken(String username, String password, String orgId) {
        UsernamePasswordAuthenticationToken authenticationRequest =
                new UsernamePasswordAuthenticationToken(username, password);
        String authenticatedLogin = authenticationManager.authenticate(authenticationRequest).getName();

        return issueTokenPair(authenticatedLogin, parseOptionalLong(orgId));
    }

    public JwtToken refreshToken(String refreshToken) {
        Map<String, Object> claims = parseAndValidate(refreshToken, JwtTokenKinds.REFRESH);
        String login = firstNonBlank(getStringClaim(claims, USER_CRG_LOGIN), getStringClaim(claims, JwtClaimNames.SUBJECT));
        if (login == null) {
            throw new BadCredentialsException("Refresh token does not contain user login");
        }

        User user = userService.getByLoginIgnoreCase(login)
                               .orElseThrow(() -> new BadCredentialsException("User not found"));
        if (!user.isEnabled()) {
            throw new BadCredentialsException("User is disabled");
        }

        return issueTokenPair(login, parseOptionalLong(claims.get(ORG_ID)));
    }

    public Map<String, Object> parseAccessToken(String tokenValue) {
        return parseAndValidate(tokenValue, JwtTokenKinds.ACCESS);
    }

    private JwtToken issueTokenPair(String login, Long orgId) {
        Map<String, Object> accessClaims = tokenClaimsService.createAccessClaims(login, orgId);
        Map<String, Object> refreshClaims = tokenClaimsService.createRefreshClaims(login, orgId);

        JwtToken token = new JwtToken();
        token.setAccess_token(buildToken(login, accessClaims, accessTokenValidityTime, JwtTokenKinds.ACCESS));
        token.setRefresh_token(buildToken(login, refreshClaims, refreshTokenValidityTime, JwtTokenKinds.REFRESH));
        token.setToken_type(TOKEN_TYPE);
        token.setExpires_in(accessTokenValidityTime);
        token.setScope(SCOPE_VALUE);

        return token;
    }

    private String buildToken(String login, Map<String, Object> claims, Integer ttlSeconds, String tokenKind) {
        Instant now = Instant.now();

        Map<String, Object> tokenClaims = new HashMap<>(claims);
        tokenClaims.put(JwtClaimNames.SUBJECT, login);
        tokenClaims.put(SCOPE, SCOPE_VALUE);
        tokenClaims.put(JwtClaimNames.TOKEN_KIND, tokenKind);
        tokenClaims.put(JwtClaimNames.ISSUED_AT, now.getEpochSecond());
        tokenClaims.put(JwtClaimNames.EXPIRATION, now.plusSeconds(ttlSeconds).getEpochSecond());

        return jwtTokenEncoder.encode(tokenClaims, secret);
    }

    private Map<String, Object> parseAndValidate(String tokenValue, String expectedTokenKind) {
        Map<String, Object> claims = jwtClaimsDecoder.decodeClaims(tokenValue, secret);
        String actualTokenKind = getStringClaim(claims, JwtClaimNames.TOKEN_KIND);
        if (actualTokenKind != null && !expectedTokenKind.equals(actualTokenKind)) {
            throw new IllegalArgumentException("Unexpected token kind");
        }

        return claims;
    }

    private String getStringClaim(Map<String, Object> claims, String claimName) {
        Object claimValue = claims.get(claimName);
        if (claimValue == null) {
            return null;
        }

        return String.valueOf(claimValue);
    }

    private Long parseOptionalLong(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Number number) {
            return number.longValue();
        }

        String stringValue = String.valueOf(value).trim();
        if (stringValue.isEmpty()) {
            return null;
        }

        return Long.valueOf(stringValue);
    }

    private String firstNonBlank(String first, String second) {
        if (first != null && !first.isBlank()) {
            return first;
        }
        if (second != null && !second.isBlank()) {
            return second;
        }

        return null;
    }
}
