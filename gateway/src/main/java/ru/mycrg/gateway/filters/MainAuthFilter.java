package ru.mycrg.gateway.filters;

import lombok.extern.log4j.Log4j2;
import org.jetbrains.annotations.NotNull;
import org.springframework.web.filter.OncePerRequestFilter;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.gateway.domain.AuthConclusion;
import ru.mycrg.gateway.domain.Authenticator;
import ru.mycrg.gateway.domain.CookieProducer;
import ru.mycrg.gateway.domain.TokenHandler;
import ru.mycrg.gateway.queue.MessageBusProducer;
import ru.mycrg.oauth_client.JwtToken;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Log4j2
public class MainAuthFilter extends OncePerRequestFilter implements CrgFilter {

    private final CookieProducer cookieProducer;
    private final Authenticator authenticator;
    private final MessageBusProducer messageBus;
    private final TokenHandler tokenHandler;

    public MainAuthFilter(CookieProducer cookieProducer,
                          Authenticator authenticator,
                          MessageBusProducer messageBus,
                          TokenHandler tokenHandler) {
        this.cookieProducer = cookieProducer;
        this.authenticator = authenticator;
        this.messageBus = messageBus;
        this.tokenHandler = tokenHandler;
    }

    @Override
    protected void doFilterInternal(@NotNull HttpServletRequest request,
                                    @NotNull HttpServletResponse response,
                                    @NotNull FilterChain chain) {
        if (isLogoutRequest(request)) {
            messageBus.produce(new CrgAuditEvent(getToken(request), "SIGN_OUT", "user", "USER", -1L));
            response.addCookie(cookieProducer.makeDeletionCookie());
        } else if (isGetTokenRequest(request)) {
            log.debug("isGetTokenRequest");

            String username = request.getParameter("username");
            String password = request.getParameter("password");
            if (username == null || password == null) {
                sendUnauthorized(response);
            } else {
                authenticator.requestToken(username, password)
                             .ifPresentOrElse(token -> {
                                 prepareResponse(response, token);
                                 messageBus.produce(
                                         new CrgAuditEvent(token.getAccess_token(), "SIGN_IN", "user", "USER", -1L));
                             }, () -> {
                                 sendUnauthorized(response);
                             });
            }
        } else if (isAllowedPaths(request)) {
            log.debug("Request to: {} Method: {}. Allow without auth", request.getServletPath(), request.getMethod());

            gotoNextFilter(request, response, chain);
        } else if (isActuatorPaths(request)) {
            gotoNextFilter(request, response, chain);
        } else if (isIntegrationPaths(request)) {
            log.debug("Request to: {}", request.getServletPath());

            gotoNextFilter(request, response, chain);
        } else {
            log.debug("Path: {}", request.getServletPath());

            tryAuthorize(request, response, chain);
        }
    }

    private String getToken(HttpServletRequest request) {
        return tokenHandler.extract(request)
                           .map(JwtToken::getAccess_token)
                           .orElse("");
    }

    private void tryAuthorize(HttpServletRequest request,
                              HttpServletResponse response,
                              FilterChain chain) {
        final AuthConclusion authConclusion = authenticator.authenticate(request);
        if ("authByAccessToken".equals(authConclusion.getCause())) {
            log.debug("Success auth by access token");

            // Передаем далее только access токен
            request.setAttribute(TEMPLATE_ATTRIBUTE, authConclusion.getToken().getAccess_token());

            gotoNextFilter(request, response, chain);
        } else if ("authByRefreshToken".equals(authConclusion.getCause())) {
            log.debug("Success auth by refresh token");

            // Передаем далее только access токен
            request.setAttribute(TEMPLATE_ATTRIBUTE, authConclusion.getToken().getAccess_token());

            // Обновим куку свежим токеном
            response.addCookie(cookieProducer.makeFromJwtToken(authConclusion.getToken()));

            gotoNextFilter(request, response, chain);
        } else if ("refreshTokenExpired".equals(authConclusion.getCause())) {
            log.debug("Refresh token expired");

            // Удалим куку/разлогинем пользователя
            response.addCookie(cookieProducer.makeDeletionCookie());

            sendUnauthorized(response);
        } else {
            log.info("Error authorize");

            // Удалим куку/разлогинем пользователя
            response.addCookie(cookieProducer.makeDeletionCookie());

            sendUnauthorized(response);
        }
    }

    private boolean isLogoutRequest(@NotNull HttpServletRequest request) {
        return "/perform_logout".equals(request.getServletPath());
    }

    private boolean isGetTokenRequest(@NotNull HttpServletRequest request) {
        return "/oauth/token".equals(request.getServletPath());
    }

    private boolean isAllowedPaths(HttpServletRequest request) {
        return isGetTokenRequest(request)
                || (request.getServletPath().equals("/organizations/init") && request.getMethod().equals("POST"))
                || (request.getServletPath().contains("/esia") && request.getMethod().equals("GET"))
                || (request.getServletPath().equals("/password-reset") && request.getMethod().equals("POST"))
                || (request.getServletPath().equals("/request-password-reset") && request.getMethod().equals("POST"));
    }

    private boolean isActuatorPaths(HttpServletRequest request) {
        return request.getMethod().equals("GET") && request.getServletPath().equals("/actuator/health");
    }

    private boolean isIntegrationPaths(HttpServletRequest request) {
        return request.getMethod().equals("POST") && request.getServletPath().contains("/integration/");
    }

    private void prepareResponse(@NotNull HttpServletResponse response, JwtToken jwtToken) {
        response.addCookie(cookieProducer.makeFromJwtToken(jwtToken));

        try {
            response.getWriter().write(jwtToken.getAccess_token());
        } catch (IOException e) {
            log.error("Error prepare response: {}", e.getMessage());
        }
    }

    // go to the next filter in the filter chain
    private void gotoNextFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain) {
        try {
            chain.doFilter(request, response);
        } catch (IOException | ServletException e) {
            log.error("Error goto the next filter", e);
        }
    }

    private void sendUnauthorized(@NotNull HttpServletResponse response) {
        try {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
        } catch (IOException e) {
            log.error("Response failed: ", e);
        }
    }
}
