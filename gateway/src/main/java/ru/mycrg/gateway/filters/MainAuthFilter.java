package ru.mycrg.gateway.filters;

import io.jsonwebtoken.ExpiredJwtException;
import lombok.extern.log4j.Log4j2;
import org.jetbrains.annotations.NotNull;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import ru.mycrg.gateway.config.CrgProperties;
import ru.mycrg.gateway.domain.CookieHandler;
import ru.mycrg.gateway.domain.TokenHandler;
import ru.mycrg.oauth_client.JwtToken;
import ru.mycrg.oauth_client.OAuthClient;
import ru.mycrg.oauth_client.OAuthClientException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static ru.mycrg.gateway.domain.Authenticator.authenticate;

@Log4j2
public class MainAuthFilter extends OncePerRequestFilter implements CrgFilter {

    private final CrgProperties properties;
    private final CookieHandler cookieHandler;
    private final TokenHandler bearerHandler;
    private final OAuthClient authClient;

    public MainAuthFilter(CookieHandler cookieHandler,
                          TokenHandler bearerHandler,
                          CrgProperties properties) {
        this.properties = properties;
        this.cookieHandler = cookieHandler;
        this.bearerHandler = bearerHandler;
        this.authClient = OAuthClient.builder()
                .url(properties.getAuthServiceUrl())
                .clientId(properties.getClientId())
                .clientSecret(properties.getClientSecret())
                .build();
    }

    @Override
    protected void doFilterInternal(@NotNull HttpServletRequest request,
                                    @NotNull HttpServletResponse response,
                                    @NotNull FilterChain chain) {
        if (isLogoutRequest(request)) {
            response.addCookie(cookieHandler.makeDeletionCookie());
        } else if (isGetTokenRequest(request)) {
            log.debug("isGetTokenRequest");

            String username = request.getParameter("username");
            String password = request.getParameter("password");
            if (username == null || password == null) {
                sendError(response);
            } else {
                try {
                    authClient
                            .getToken(username, password)
                            .ifPresentOrElse(
                                    jwtToken -> prepareResponse(response, jwtToken),
                                    () -> sendError(response)
                            );
                } catch (OAuthClientException e) {
                    sendError(response);
                }
            }
        } else if (isAllowedPaths(request)) {
            log.debug("Request to: {} Method: {}. Allow without auth", request.getServletPath(), request.getMethod());

            gotoNextFilter(request, response, chain);
        } else {
            log.debug("Path: {}", request.getServletPath());

            bearerHandler
                    .extractToken(request)
                    .ifPresentOrElse(jwtToken -> {
                        authorizeWithToken(request, response, chain, jwtToken);
                    }, () -> {
                        cookieHandler
                                .extractToken(request)
                                .ifPresentOrElse(jwtToken -> {
                                    authorizeWithToken(request, response, chain, jwtToken);
                                }, () -> {
                                    gotoNextFilter(request, response, chain);
                                });
                    });
        }
    }

    private void prepareResponse(@NotNull HttpServletResponse response, JwtToken jwtToken) {
        response.addCookie(cookieHandler.makeCookie(jwtToken));

        try {
            response.getWriter().write(jwtToken.getAccess_token());
        } catch (IOException e) {
            log.error("Error prepare response: {}", e.getMessage());
        }
    }

    private void authorizeWithToken(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain,
                                    JwtToken jwtToken) {
        try {
            if (authenticate(jwtToken, properties.getSecret())) {
                log.debug("success auth");

                request.setAttribute(TEMPLATE_ATTRIBUTE, jwtToken.getAccess_token());

                gotoNextFilter(request, response, chain);
            } else {
                sendError(response);
            }
        } catch (ExpiredJwtException expired) {
            log.debug("Token expired");

            JwtToken newTokenModel = refreshToken(jwtToken);
            if (newTokenModel != null) {
                log.debug("Modify cookie by new token");

                // Передаем далее только access токен
                request.setAttribute(TEMPLATE_ATTRIBUTE, newTokenModel.getAccess_token());

                // Обновим токены в куке
                response.addCookie(cookieHandler.makeCookie(newTokenModel));

                gotoNextFilter(request, response, chain);
            } else {
                log.debug("Refresh token expired");

                response.addCookie(cookieHandler.makeDeletionCookie());

                sendError(response);
            }
        } catch (Exception e) {
            clearContext(e, "Not authenticated");
        }
    }

    private boolean isLogoutRequest(@NotNull HttpServletRequest request) {
        return "/perform_logout".equals(request.getServletPath());
    }

    private boolean isGetTokenRequest(@NotNull HttpServletRequest request) {
        return "/oauth/token".equals(request.getServletPath());
    }

    private JwtToken refreshToken(JwtToken tokenModel) {
        try {
            if (tokenModel.getRefresh_token() == null) {
                throw new IllegalArgumentException("Refresh token not passed");
            }

            log.debug("Try use refresh token");
            final JwtToken[] token = new JwtToken[1];
            authClient
                    .refreshToken(tokenModel.getRefresh_token())
                    .ifPresent(newToken -> {
                        authenticate(newToken, properties.getSecret());

                        token[0] = newToken;
                    });

            return token[0];
        } catch (Exception e) {
            clearContext(e, "Cant refresh token");
        }

        return null;
    }

    private boolean isAllowedPaths(HttpServletRequest request) {
        return isGetTokenRequest(request)
                || (request.getServletPath().equals("/organizations/init") && request.getMethod().equals("POST"));
    }

    // go to the next filter in the filter chain
    private void gotoNextFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain) {
        try {
            chain.doFilter(request, response);
        } catch (IOException | ServletException e) {
            log.error("Error goto the next filter", e);
        }
    }

    /**
     * In case of failure. Make sure it's clear; so guarantee user won't be authenticated
     */
    private void clearContext(Exception e, String s) {
        log.error(s, e);

        SecurityContextHolder.clearContext();
    }

    private void sendError(@NotNull HttpServletResponse response) {
        try {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
        } catch (IOException e) {
            log.error("Response failed: ", e);
        }
    }

}
