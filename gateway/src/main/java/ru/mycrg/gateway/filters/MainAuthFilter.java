package ru.mycrg.gateway.filters;

import lombok.extern.log4j.Log4j2;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.web.filter.OncePerRequestFilter;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.auth_service_contract.dto.IdNameProjection;
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
import java.util.List;

import static org.apache.commons.lang.CharEncoding.UTF_8;
import static ru.mycrg.gateway.GatewayApplication.objectMapper;
import static ru.mycrg.http_client.JsonConverter.toJsonNode;

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
                sendUnauthorized(response, request.getParameter("orgId"), "Имя пользователя или пароль отсутствуют");
            } else {
                authorize(request, response, username, password);
            }
        } else if (isAllowedPaths(request)) {
            log.debug("Allow without auth for request to: '{}' and method: '{}'",
                      request.getServletPath(), request.getMethod());

            gotoNextFilter(request, response, chain);
        } else if (isActuatorPaths(request)) {
            gotoNextFilter(request, response, chain);
        } else if (isAuthWithIntegrationTokenPaths(request)) {
            log.debug("Auth with integration token for path: {}", request.getServletPath());

            gotoNextFilter(request, response, chain);
        } else {
            log.debug("Default auth for path: {}", request.getServletPath());

            tryAuthorize(request, response, chain);
        }
    }

    private void authorize(@NotNull HttpServletRequest request,
                           @NotNull HttpServletResponse response,
                           String usernameRaw,
                           String password) {
        response.setContentType(request.getContentType());
        response.setCharacterEncoding(UTF_8);

        String username = usernameRaw.trim();
        if (isNotCorrectLoginPass(username, password)) {
            sendUnauthorized(response,
                             request.getParameter("orgId"),
                             "Попытка авторизоваться с неверными именем или паролем: " + username + "/" + password);

            return;
        }

        String orgId = request.getParameter("orgId");
        log.debug("orgId: '{}'", orgId);

        if (orgId == null) {
            List<IdNameProjection> orgs = authenticator.getOrganizations(username);
            if (orgs == null) { // Не удалось получить ничего, по причине невалидного пользователя, например.
                log.debug("Unauthorized: '{}'", username);

                sendUnauthorized(response,
                                 request.getParameter("orgId"),
                                 "Попытка авторизоваться в организации: " + orgId + " пользователем: " + username);
            } else if (orgs.isEmpty()) { // Пустой список организаций отдаётся сейчас супер пользователю!
                log.debug("Is root? '{}'", username);

                authWithOrgId(response, username, password, null);
            } else if (orgs.size() == 1) { // Когда пользователь состоит только в одной организации
                log.debug("Only one organization");

                orgId = orgs.get(0).getId().toString();

                authWithOrgId(response, username, password, orgId);
            } else { // Когда пользователь состоит в нескольких организациях
                log.debug("Many organizations");
                orgs.forEach(org -> log.debug("id: '{}' Title: '{}'", org.getId(), org.getName()));

                addOrgInfoToResponse(response, orgs);
            }
        } else {
            authWithOrgId(response, username, password, orgId);
        }
    }

    private void authWithOrgId(@NotNull HttpServletResponse response, String username, String password, String orgId) {
        log.debug("Авторизация в конкретную организацию: {}", orgId);

        authenticator.requestToken(username, password, orgId)
                     .ifPresentOrElse(token -> {
                         addCookieAndTokenToResponse(response, token);

                         messageBus.produce(
                                 new CrgAuditEvent(token.getAccess_token(), "SIGN_IN", "user", "USER", -1L));
                     }, () -> {
                         sendUnauthorized(response,
                                          null,
                                          "Пользователем: " + username + " не удалось зайти в организацию: " + orgId);
                     });
    }

    private boolean isNotCorrectLoginPass(String username, String password) {
        return authenticator.requestToken(username, password, null)
                            .isEmpty();
    }

    private String getToken(HttpServletRequest request) {
        return tokenHandler.extract(request)
                           .map(JwtToken::getAccess_token)
                           .orElse("");
    }

    private void tryAuthorize(HttpServletRequest request,
                              HttpServletResponse response,
                              FilterChain chain) {
        AuthConclusion authConclusion = authenticator.authenticate(request);

        JwtToken token = authConclusion.getToken();

        if ("authByAccessToken".equals(authConclusion.getCause())) {
            log.debug("Успешно авторизованы по access-токену");

            // Передаем далее только access токен
            request.setAttribute(TEMPLATE_ATTRIBUTE, token.getAccess_token());

            gotoNextFilter(request, response, chain);
        } else if ("authByRefreshToken".equals(authConclusion.getCause())) {
            log.debug("Успешно авторизованы по refresh-токену");

            // Передаем далее только access токен
            request.setAttribute(TEMPLATE_ATTRIBUTE, token.getAccess_token());

            // Обновим куку свежим токеном
            response.addCookie(cookieProducer.makeFromJwtToken(token));

            gotoNextFilter(request, response, chain);
        } else if ("refreshTokenNotPassed".equals(authConclusion.getCause())) {
            log.warn("Refresh-токен не предоставлен");

            // Удалим куку/разлогинем пользователя
            response.addCookie(cookieProducer.makeDeletionCookie());

            if (token == null) {
                log.debug("Не предоставлен ни refresh, ни access токены!");

                sendUnauthorized(response, request.getParameter("orgId"), "Не предоставлен ни refresh, ни access токены!");
            } else if (token.getAccess_token() != null) {
                log.debug("Попытка авторизации без токена восстановления. Токен авторизации: {}",
                          token.getAccess_token());

                sendUnauthorized(response, request.getParameter("orgId"), "Попытка авторизации без токена восстановления");
            }
        } else if ("refreshTokenExpired".equals(authConclusion.getCause())) {
            log.debug("Refresh-токен просрочен");

            // Удалим куку/разлогинем пользователя
            response.addCookie(cookieProducer.makeDeletionCookie());

            sendUnauthorized(response, request.getParameter("orgId"),
                             "Попытка авторизации с просроченным токеном: " + token.getAccess_token());
        } else {
            log.info("Не удалось авторизоваться");

            // Удалим куку/разлогинем пользователя
            response.addCookie(cookieProducer.makeDeletionCookie());

            sendUnauthorized(response, request.getParameter("orgId"),
                             "Не удалось авторизоваться. Токен: " + token.getAccess_token());
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
                || (request.getServletPath().equals("/organizations/intents") && request.getMethod().equals("POST"))
                || (request.getServletPath().contains("/esia") && request.getMethod().equals("GET"))
                || (request.getServletPath().equals("/specializations") && request.getMethod().equals("GET"))
                || (request.getServletPath().equals("/password-reset") && request.getMethod().equals("POST"))
                || (request.getServletPath().equals("/password-reset") && request.getMethod().equals("GET"))
                || (request.getServletPath().equals("/request-password-reset") && request.getMethod().equals("POST"));
    }

    private boolean isActuatorPaths(HttpServletRequest request) {
        return request.getMethod().equals("GET") && request.getServletPath().equals("/actuator/health");
    }

    private boolean isAuthWithIntegrationTokenPaths(HttpServletRequest request) {
        String method = request.getMethod();
        String path = request.getServletPath();

        return method.equals("POST")
                && (path.contains("/integration/ais_ums") || path.contains("/integration/statement"));
    }

    private void addOrgInfoToResponse(HttpServletResponse response, List<IdNameProjection> orgs) {
        try {
            String jsonString = objectMapper.writeValueAsString(orgs);

            response.getWriter().write(jsonString);
        } catch (IOException e) {
            log.error("Error prepare response: {}", e.getMessage());
        }
    }

    private void addCookieAndTokenToResponse(@NotNull HttpServletResponse response, JwtToken jwtToken) {
        response.addCookie(cookieProducer.makeFromJwtToken(jwtToken));

        try {
            response.getWriter().write(jwtToken.getAccess_token());
        } catch (IOException e) {
            log.error("Error prepare cookie response: {}", e.getMessage());
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

    private void sendUnauthorized(@NotNull HttpServletResponse response,
                                  @Nullable String orgId,
                                  String reason) {
        try {
            long orgIdentityId = orgId != null ? Long.parseLong(orgId) : -1L;

            CrgAuditEvent auditEvent = new CrgAuditEvent();
            auditEvent.setActionType("SIGN_FAIL");
            auditEvent.setEntityName("user");
            auditEvent.setEntityType("USER");
            auditEvent.setEntityId(orgIdentityId);
            auditEvent.setEntityStateAfter(toJsonNode(String.format("Организация: %d. %s", orgIdentityId, reason)));

            messageBus.produce(auditEvent);

            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
        } catch (IOException e) {
            log.error("Response failed: ", e);
        }
    }
}
