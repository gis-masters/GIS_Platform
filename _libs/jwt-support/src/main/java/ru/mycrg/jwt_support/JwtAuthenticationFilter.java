package ru.mycrg.jwt_support;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import ru.mycrg.auth_facade.JwtAuthenticationDetails;
import ru.mycrg.auth_facade.JwtDetails;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static ru.mycrg.jwt_support.JwtClaimNames.AUTHORITIES;
import static ru.mycrg.jwt_support.JwtClaimNames.TOKEN_KIND;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtClaimsDecoder jwtClaimsDecoder;
    private final byte[] secret;
    private final String expectedTokenKind;
    private final String principalClaimName;
    private final String authoritiesClaimName;

    public JwtAuthenticationFilter(String secret) {
        this(new JwtClaimsDecoder(), secret, null, JwtDetails.USER_NAME, AUTHORITIES);
    }

    public JwtAuthenticationFilter(String secret, String expectedTokenKind) {
        this(new JwtClaimsDecoder(), secret, expectedTokenKind, JwtDetails.USER_NAME, AUTHORITIES);
    }

    public JwtAuthenticationFilter(JwtClaimsDecoder jwtClaimsDecoder,
                                   String secret,
                                   String expectedTokenKind,
                                   String principalClaimName,
                                   String authoritiesClaimName) {
        this.jwtClaimsDecoder = jwtClaimsDecoder;
        this.secret = secret.getBytes(StandardCharsets.UTF_8);
        this.expectedTokenKind = expectedTokenKind;
        this.principalClaimName = principalClaimName;
        this.authoritiesClaimName = authoritiesClaimName;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String authorization = request.getHeader("Authorization");
        if (authorization != null
                && authorization.startsWith(BEARER_PREFIX)
                && SecurityContextHolder.getContext().getAuthentication() == null) {
            String tokenValue = authorization.substring(BEARER_PREFIX.length());
            try {
                Map<String, Object> claims = jwtClaimsDecoder.decodeClaims(tokenValue, secret);
                validateExpectedTokenKind(claims);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                claims.get(principalClaimName), null, toGrantedAuthorities(claims.get(authoritiesClaimName))
                        );
                authentication.setDetails(new JwtAuthenticationDetails(tokenValue, claims));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (IllegalArgumentException e) {
                log.debug("JWT auth skipped: {}", e.getMessage());
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }

    private void validateExpectedTokenKind(Map<String, Object> claims) {
        if (expectedTokenKind == null) {
            return;
        }

        Object actualTokenKind = claims.get(TOKEN_KIND);
        if (actualTokenKind != null && !expectedTokenKind.equals(String.valueOf(actualTokenKind))) {
            throw new IllegalArgumentException("Unexpected token kind");
        }
    }

    private List<SimpleGrantedAuthority> toGrantedAuthorities(Object authoritiesClaim) {
        if (!(authoritiesClaim instanceof List<?> authorities)) {
            return List.of();
        }

        return authorities.stream()
                          .map(String::valueOf)
                          .map(SimpleGrantedAuthority::new)
                          .collect(Collectors.toList());
    }
}
