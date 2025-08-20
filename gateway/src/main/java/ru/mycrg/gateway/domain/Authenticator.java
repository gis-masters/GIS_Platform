package ru.mycrg.gateway.domain;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import lombok.extern.log4j.Log4j2;
import org.jetbrains.annotations.NotNull;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.dto.IdNameProjection;
import ru.mycrg.auth_service_contract.dto.UserInfoModel;
import ru.mycrg.gateway.exceptions.CrgGatewayException;
import ru.mycrg.http_client.exceptions.HttpClientException;
import ru.mycrg.oauth_client.JwtToken;
import ru.mycrg.oauth_client.OAuthClient;

import javax.servlet.http.HttpServletRequest;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.util.Objects.nonNull;
import static ru.mycrg.auth_facade.JwtDetails.VERSION;

@Log4j2
@Service
public class Authenticator {

    private final OAuthClient authClient;
    private final TokenHandler tokenHandler;
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
            final Claims claims = validateToken(token);

            checkIfTokenNeedUpdated(token, claims);

            if (setAuthentication(claims)) {
                return new AuthConclusion(token, "authByAccessToken");
            } else {
                return new AuthConclusion(token, "IncorrectClaims");
            }
        } catch (ExpiredJwtException expired) {
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
            final Claims claims = validateToken(refreshedToken);
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

    private void checkIfTokenNeedUpdated(JwtToken token, Claims claims) throws HttpClientException {
        UserInfoModel currentUser = authClient.getCurrentUser(token.getAccess_token());
        log.debug("Пользователь {}", currentUser);
        if (!currentUser.isEnabled()) {
            throw new CrgGatewayException("Пользователь не активен");
        }
        Short userVersion = currentUser.getVersion();
        Short tokenVersion = claims.get(VERSION, Short.class);
        if (nonNull(userVersion) && !userVersion.equals(tokenVersion)) {
            throw new ExpiredJwtException(null, claims, "Токен пользователя устарел");
        }
    }

    @NotNull
    private Boolean setAuthentication(Claims claims) {
        log.debug("Claims: {}", claims);

        String username = claims.get("user_name").toString();
        if (username != null) {
            @SuppressWarnings("unchecked")
            List<String> authorities = (List<String>) claims.get("authorities");

            // Create auth object: UsernamePasswordAuthenticationToken: A built-in object, used by spring to represent
            // the current authenticated / being authenticated user.
            // It needs a list of authorities, which has type of GrantedAuthority interface, where
            // SimpleGrantedAuthority is an implementation of that interface
            final List<SimpleGrantedAuthority> grantedAuthorities = authorities.stream()
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

    private Claims validateToken(JwtToken tokenModel) throws ExpiredJwtException {
        return Jwts.parser()
                   .setSigningKey(secret.getBytes())
                   .parseClaimsJws(tokenModel.getAccess_token())
                   .getBody();
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
}
