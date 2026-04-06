package ru.mycrg.gateway.domain;

import jakarta.servlet.http.HttpServletRequest;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.dto.IdNameProjection;
import ru.mycrg.auth_service_contract.dto.UserInfoModel;
import ru.mycrg.gateway.exceptions.CrgGatewayException;
import ru.mycrg.http_client.exceptions.HttpClientException;
import ru.mycrg.jwt_support.JwtClaimNames;
import ru.mycrg.jwt_support.JwtClaimsDecoder;
import ru.mycrg.jwt_support.JwtExpiredException;
import ru.mycrg.oauth_client.JwtToken;
import ru.mycrg.oauth_client.OAuthClient;

import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.util.Objects.nonNull;
import static ru.mycrg.auth_facade.JwtDetails.USER_NAME;
import static ru.mycrg.auth_facade.JwtDetails.VERSION;

@Service
public class Authenticator {

    private static final Logger log = LoggerFactory.getLogger(Authenticator.class);

    private final OAuthClient authClient;
    private final TokenHandler tokenHandler;
    private final JwtClaimsDecoder jwtClaimsDecoder = new JwtClaimsDecoder();
    private final String secret;
    private final String basicAuthAsBase64;

    public Authenticator(Environment environment, OAuthClient authClient, TokenHandler tokenHandler) {
        String clientId = environment.getRequiredProperty("crg-options.jwt.client-id");
        String clientSecret = environment.getRequiredProperty("crg-options.jwt.client-secret");
        basicAuthAsBase64 = Base64.getEncoder().encodeToString((clientId + ":" + clientSecret).getBytes());

        secret = environment.getRequiredProperty("crg-options.jwt.secret");

        this.authClient = authClient;
        this.tokenHandler = tokenHandler;
    }

    @NotNull
    public AuthConclusion authenticate(@NotNull HttpServletRequest request) {
        Optional<JwtToken> oToken = tokenHandler.extract(request);
        if (oToken.isEmpty()) {
            return new AuthConclusion(null, "tokenNotFound");
        }

        final JwtToken token = oToken.get();
        try {
            final Map<String, Object> claims = validateToken(token);

            checkIfTokenNeedUpdated(token, claims);

            if (setAuthentication(claims)) {
                return new AuthConclusion(token, "authByAccessToken");
            } else {
                return new AuthConclusion(token, "IncorrectClaims");
            }
        } catch (JwtExpiredException expired) {
            log.debug("Access token expired");

            if (token.getRefresh_token() == null) {
                return new AuthConclusion(null, "refreshTokenNotPassed");
            } else {
                log.debug("Try restore from refresh");
            }

            oToken = refreshToken(token);
            if (oToken.isEmpty()) {
                log.debug("cant use refresh token");

                return new AuthConclusion(null, "refreshTokenExpired");
            }

            final JwtToken refreshedToken = oToken.get();
            final Map<String, Object> claims = validateToken(refreshedToken);
            if (setAuthentication(claims)) {
                return new AuthConclusion(refreshedToken, "authByRefreshToken");
            } else {
                log.warn("Error auth with refreshedToken");

                return new AuthConclusion(token, "IncorrectClaims");
            }
        } catch (Exception e) {
            log.error("Error authentication: {}", e.getMessage());

            return new AuthConclusion(null, "error");
        }
    }

    public Optional<JwtToken> requestToken(String username, String password, String orgId) {
        try {
            JwtToken token = authClient.getToken(username, password, orgId);
            if (token != null) {
                return Optional.of(token);
            } else {
                return Optional.empty();
            }
        } catch (HttpClientException e) {
            return Optional.empty();
        }
    }

    public List<IdNameProjection> getOrganizations(String username) {
        List<IdNameProjection> result = null;

        try {
            log.debug("Try to get organizations for user: {}", username);

            List<IdNameProjection> projections = authClient.getUserOrganizations(username);
            if (projections != null) {
                result = projections;
            }
        } catch (HttpClientException e) {
            log.warn("Failed to fetch user organizations. Reason: {}", e.getMessage());
        }

        return result;
    }

    private void checkIfTokenNeedUpdated(JwtToken token, Map<String, Object> claims) throws HttpClientException {
        UserInfoModel currentUser = authClient.getCurrentUser(token.getAccess_token());
        log.debug("Пользователь {}", currentUser);
        if (!currentUser.isEnabled()) {
            throw new CrgGatewayException("Пользователь не активен");
        }
        Short userVersion = currentUser.getVersion();
        Short tokenVersion = toShort(claims.get(VERSION));
        if (nonNull(userVersion) && !userVersion.equals(tokenVersion)) {
            throw new JwtExpiredException("Токен пользователя устарел");
        }
    }

    @NotNull
    private Boolean setAuthentication(Map<String, Object> claims) {
        log.debug("Claims: {}", claims);

        Object usernameClaim = claims.get(USER_NAME);
        String username = usernameClaim == null ? null : String.valueOf(usernameClaim);
        if (username != null) {
            List<?> authorities = claims.get(JwtClaimNames.AUTHORITIES) instanceof List<?> rawAuthorities
                    ? rawAuthorities
                    : List.of();

            // Create auth object: UsernamePasswordAuthenticationToken: A built-in object, used by spring to represent
            // the current authenticated / being authenticated user.
            // It needs a list of authorities, which has type of GrantedAuthority interface, where
            // SimpleGrantedAuthority is an implementation of that interface
            final List<SimpleGrantedAuthority> grantedAuthorities = authorities.stream()
                                                                               .map(String::valueOf)
                                                                               .map(SimpleGrantedAuthority::new)
                                                                               .collect(Collectors.toList());

            // 3. Authenticate the user. Now, user is authenticated
            final var auth = new UsernamePasswordAuthenticationToken(username, null, grantedAuthorities);
            SecurityContextHolder.getContext().setAuthentication(auth);

            return true;
        } else {
            log.warn("Incorrect claims, username not exist");

            return false;
        }
    }

    private Map<String, Object> validateToken(JwtToken tokenModel) throws JwtExpiredException {
        return jwtClaimsDecoder.decodeClaims(tokenModel.getAccess_token(), secret);
    }

    private Optional<JwtToken> refreshToken(JwtToken tokenModel) {
        try {
            if (tokenModel.getRefresh_token() == null) {
                throw new IllegalArgumentException("Refresh token not passed");
            }

            final JwtToken jwtToken = authClient.refreshToken(tokenModel.getRefresh_token(),
                                                              basicAuthAsBase64);

            return Optional.ofNullable(jwtToken);
        } catch (HttpClientException e) {
            log.error("Failed refresh token: {}", e.getMessage());

            return Optional.empty();
        }
    }

    private Short toShort(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Number number) {
            return number.shortValue();
        }

        return Short.valueOf(String.valueOf(value));
    }
}
