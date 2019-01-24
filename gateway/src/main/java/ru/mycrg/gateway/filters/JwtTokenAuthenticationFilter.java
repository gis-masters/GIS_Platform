package ru.mycrg.gateway.filters;

import ru.mycrg.gateway.config.JwtConfig;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

public class JwtTokenAuthenticationFilter extends OncePerRequestFilter {

    private static Logger log = LoggerFactory.getLogger(JwtTokenAuthenticationFilter.class);

    private final JwtConfig jwtConfig;

    public JwtTokenAuthenticationFilter(JwtConfig jwtConfig) {
        this.jwtConfig = jwtConfig;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        log.info("Fiz JwtTokenAuthenticationFilter doFilterInternal");

        if (request.getServletPath().contains("/oauth/token") || request.getServletPath().contains("/organizations")) {
            log.info("is /oauth/token | organizations");
        } else {
            // 1. get the authentication header.
            String token = request.getParameter("access_token");
            if (token == null) {
                // Tokens are supposed to be passed in the authentication header
                String header = request.getHeader(jwtConfig.getHeader());

                log.info("header: {}", header);

                // 2. validate the header and check the prefix
                if (header == null || !header.startsWith(jwtConfig.getPrefix())) {
                    chain.doFilter(request, response); // If not valid, go to the next filter.

                    log.info("not valid, go to the next filter");
                    return;
                }

                // If there is no token provided and hence the user won't be authenticated.
                // It's Ok. Maybe the user accessing a public path or asking for a token.

                // All secured paths that needs a token are already defined and secured in config class.
                // And If user tried to access without access token, then he won't be authenticated and an exception will be thrown.

                // 3. Get the token
                token = header.replace(jwtConfig.getPrefix(), "");
            }

            try {    // exceptions might be thrown in creating the claims if for example the token is expired
                // 4. Validate the token
                Claims claims = Jwts.parser()
                        .setSigningKey(jwtConfig.getSecret().getBytes())
                        .parseClaimsJws(token)
                        .getBody();

                log.info("Claims: {}", claims);

                String username = claims.get("user_name").toString();
                if (username != null) {
                    @SuppressWarnings("unchecked")
                    List<String> authorities = (List<String>) claims.get("authorities");

                    // 5. Create auth object
                    // UsernamePasswordAuthenticationToken: A built-in object, used by spring to represent the current authenticated / being authenticated user.
                    // It needs a list of authorities, which has type of GrantedAuthority interface, where SimpleGrantedAuthority is an implementation of that interface
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                            username, null, authorities.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList()));

                    // 6. Authenticate the user. Now, user is authenticated
                    log.info("Now, user is authenticated: {}", auth);
                    SecurityContextHolder.getContext().setAuthentication(auth);
                } else {
                    log.warn("Incorrect claims, username not exist");
                }
            } catch (ExpiredJwtException expired) {
                log.warn("JWT expired", expired);

                // TODO: Do something
            } catch (Exception e) {
                // In case of failure. Make sure it's clear; so guarantee user won't be authenticated
                log.error("Not authenticated. ", e);

                SecurityContextHolder.clearContext();
            }
        }

        // go to the next filter in the filter chain
        chain.doFilter(request, response);
    }
}
