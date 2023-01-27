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
import ru.mycrg.http_client.exceptions.HttpClientException;
import ru.mycrg.oauth_client.JwtToken;
import ru.mycrg.oauth_client.OAuthClient;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Log4j2
@Service
public class Authenticator {

    private final OAuthClient authClient;
    private final TokenHandler tokenHandler;
    private final String secret;

    public Authenticator(Environment environment, OAuthClient authClient, TokenHandler tokenHandler) {
        secret = environment.getRequiredProperty("crg-options.secret");

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

            if (setAuthentication(claims)) {
                return new AuthConclusion(token, "authByAccessToken");
            } else {
                return new AuthConclusion(token, "IncorrectClaims");
            }
        } catch (ExpiredJwtException expired) {
            log.debug("Access token expired");

            if (token.getRefresh_token() == null) {
                log.warn("Refresh token not passed");

                return new AuthConclusion(null, "refreshTokenExpired");
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
            log.error("Error authentication: {}", e.getCause().getMessage());

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

            final JwtToken jwtToken = authClient.refreshToken(tokenModel.getRefresh_token());

            return Optional.ofNullable(jwtToken);
        } catch (HttpClientException e) {
            log.error("Failed refresh token: {}", e.getMessage());

            return Optional.empty();
        }
    }
}
