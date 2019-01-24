package ru.mycrg.gis.config;

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

            // 3. Get the token
            token = header.replace(jwtConfig.getPrefix(), "");
            try {    // exceptions might be thrown in creating the claims if for example the token is expired
                Claims claims = Jwts.parser()
                        .setSigningKey(jwtConfig.getSecret().getBytes())
                        .parseClaimsJws(token)
                        .getBody();

                String username = claims.get("user_name").toString();
                if (username != null) {
                    @SuppressWarnings("unchecked")
                    List<String> authorities = (List<String>) claims.get("authorities");

                    UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(username, null, authorities.stream()
                                    .map(SimpleGrantedAuthority::new)
                                    .collect(Collectors.toList()));

                    log.info("Now, user is authenticated: {}", auth);
                    SecurityContextHolder.getContext().setAuthentication(auth);
                } else {
                    log.warn("Incorrect claims, username not exist");
                }
            } catch (ExpiredJwtException expired) {
                log.warn("JWT expired", expired);
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
