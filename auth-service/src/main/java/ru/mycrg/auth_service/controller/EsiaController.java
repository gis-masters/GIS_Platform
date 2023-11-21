package ru.mycrg.auth_service.controller;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.auth_service.dto.UserProjection;
import ru.mycrg.auth_service.service.*;
import ru.mycrg.auth_service_contract.dto.UserCreateDto;
import ru.mycrg.auth_service_contract.dto.esia.EsiaUserInfo;
import ru.mycrg.oauth_client.JwtToken;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.net.MalformedURLException;
import java.util.Optional;
import java.util.UUID;

import static java.lang.Thread.sleep;
import static org.springframework.http.HttpStatus.FOUND;

@RestController
public class EsiaController {

    public static final String ESIA = "esia";

    private final Logger log = LoggerFactory.getLogger(EsiaController.class);

    private final Environment environment;
    private final EsiaService esiaService;
    private final UserService userService;
    private final GroupService groupService;
    private final AuthService authService;
    private final CookieProducer cookieProducer;

    private String state;

    public EsiaController(Environment environment,
                          EsiaService esiaService,
                          UserService userService,
                          GroupService groupService,
                          AuthService authService,
                          CookieProducer cookieProducer) {
        this.environment = environment;
        this.esiaService = esiaService;
        this.userService = userService;
        this.groupService = groupService;
        this.authService = authService;
        this.cookieProducer = cookieProducer;
    }

    @GetMapping("/esia")
    public ResponseEntity<String> esiaAuthorize(@RequestParam String redirect) throws MalformedURLException {
        state = UUID.randomUUID().toString();
        log.debug("ESIA authorization init. State: {}", state);

        String esiaAuthUrl = esiaService.buildAuthorizeUrl(state, redirect);

        log.debug("esiaAuthUrl: {}", esiaAuthUrl);

        return ResponseEntity.ok(esiaAuthUrl);
    }

    @GetMapping("/esia/ok")
    public ResponseEntity<String> esiaOk(@RequestParam String redirect,
                                         @RequestParam String code,
                                         @RequestParam String state,
                                         HttpServletResponse response) {
        try {
            log.debug("ESIA-ok Redirect url: [{}] \n Code: '{}' \n State: '{}'", redirect, code, state);
            Long orgId = Long.valueOf(environment.getRequiredProperty("esia.org_id"));
            Long groupId = Long.valueOf(environment.getRequiredProperty("esia.group_id"));

            if (!this.state.equals(state)) {
                log.warn("Incorrect state: initial_state: {} / requested_state: {}", this.state, state);

                return redirectTo(redirect);
            }

            esiaService.getUser(redirect, code, state)
                       .ifPresent(esiaUser -> {
                           log.debug("EsiaUserInfo: {}", esiaUser);

                           if (!userService.isExist(esiaUser.getEmail())) {
                               String accessToken = authService.getRootAccessToken();

                               createUser(orgId, esiaUser, accessToken).ifPresent(newUser -> {
                                   waitUserCreation();

                                   joinToGroup(orgId, groupId, newUser, accessToken);
                               });
                           }

                           JwtToken jwtToken = authService.authorize(esiaUser.getEmail(), "Fiz" + esiaUser.getSbjId());
                           Cookie cookie = cookieProducer.makeFromJwtToken(jwtToken);

                           response.addCookie(cookie);
                       });
        } catch (Exception e) {
            String reason = "unknown";
            if (e.getMessage() != null) {
                reason = e.getMessage();
            } else if (e.getCause() != null && e.getCause().getMessage() != null) {
                reason = e.getCause().getMessage();
            }

            log.error("Не удалось авторизоваться через портал госуслуг. State: {}. Reason: {}", state, reason);
        }

        return redirectTo(redirect);
    }

    private void waitUserCreation() {
        try {
            sleep(1111);
        } catch (InterruptedException e) {
            log.warn("Interrupted!", e);

            // Restore interrupted state...
            Thread.currentThread().interrupt();
        }
    }

    @NotNull
    private ResponseEntity<String> redirectTo(String redirect) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Location", redirect);

        return new ResponseEntity<>(headers, FOUND);
    }

    private Optional<UserProjection> createUser(Long orgId, EsiaUserInfo esiaUser, String accessToken) {
        try {
            UserCreateDto dto = new UserCreateDto(esiaUser.getFirstName(),
                                                  esiaUser.getLastName(),
                                                  esiaUser.getEmail(),
                                                  "Fiz" + esiaUser.getSbjId(),
                                                  esiaUser.getMiddleName(),
                                                  ESIA,
                                                  "+79781111111");

            UserProjection userProjection = userService.create(dto, orgId, accessToken, ESIA, true);

            return Optional.ofNullable(userProjection);
        } catch (Exception e) {
            log.error("Не удалось создать пользователя. Reason: {}", e.getMessage(), e.getCause());
        }

        return Optional.empty();
    }

    private void joinToGroup(Long orgId, Long groupId, UserProjection newUser, String accessToken) {
        try {
            groupService.addUser(orgId, groupId, newUser.getId(), ESIA, accessToken);
        } catch (Exception e) {
            log.error("При авторизации через госулсуги не удалось добавить пользователя в группу. " +
                              "Убедитесь что указали корректный ID группы. Текущий GROUP_ID: {}. Reason: {}",
                      groupId, e.getMessage());
        }
    }
}
