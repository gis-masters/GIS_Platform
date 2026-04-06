package ru.mycrg.auth_service.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.auth_service.exceptions.BadRequestException;
import ru.mycrg.auth_service.security.JwtTokenService;
import ru.mycrg.oauth_client.JwtToken;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.Map;

@RestController
public class OAuthTokenController {

    private static final String PASSWORD_GRANT_TYPE = "password";
    private static final String REFRESH_TOKEN_GRANT_TYPE = "refresh_token";

    private final JwtTokenService jwtTokenService;
    private final String clientId;
    private final String clientSecret;

    public OAuthTokenController(JwtTokenService jwtTokenService,
                                @Value("${security.jwt.client_id}") String clientId,
                                @Value("${security.jwt.client_secret}") String clientSecret) {
        this.jwtTokenService = jwtTokenService;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }

    @PostMapping("/oauth/token")
    public ResponseEntity<?> issueToken(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false)
                                        String authorization,
                                        @RequestParam MultiValueMap<String, String> parameters) {
        try {
            validateClientCredentials(authorization);

            String grantType = required(parameters, "grant_type");
            if (PASSWORD_GRANT_TYPE.equals(grantType)) {
                JwtToken token = jwtTokenService.issuePasswordToken(required(parameters, "username"),
                                                                   required(parameters, "password"),
                                                                   parameters.getFirst("orgId"));

                return ok(token);
            }
            if (REFRESH_TOKEN_GRANT_TYPE.equals(grantType)) {
                JwtToken token = jwtTokenService.refreshToken(required(parameters, "refresh_token"));

                return ok(token);
            }

            return error(HttpStatus.BAD_REQUEST, "unsupported_grant_type", "Unsupported grant_type: " + grantType);
        } catch (BadCredentialsException e) {
            return error(HttpStatus.UNAUTHORIZED, "invalid_grant", e.getMessage());
        } catch (BadRequestException | IllegalArgumentException e) {
            return error(HttpStatus.BAD_REQUEST, "invalid_request", e.getMessage());
        }
    }

    private ResponseEntity<JwtToken> ok(JwtToken token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setCacheControl("no-store");
        headers.add("Pragma", "no-cache");

        return new ResponseEntity<>(token, headers, HttpStatus.OK);
    }

    private ResponseEntity<Map<String, String>> error(HttpStatus status, String error, String description) {
        String safeDescription = description == null || description.isBlank()
                ? status.getReasonPhrase()
                : description;

        return ResponseEntity.status(status)
                             .body(Map.of("error", error, "error_description", safeDescription));
    }

    private void validateClientCredentials(String authorization) {
        if (authorization == null || !authorization.startsWith("Basic ")) {
            throw new BadCredentialsException("Client credentials are required");
        }

        String rawCredentials;
        try {
            rawCredentials = new String(Base64.getDecoder()
                                              .decode(authorization.substring("Basic ".length())),
                                        StandardCharsets.UTF_8);
        } catch (IllegalArgumentException e) {
            throw new BadCredentialsException("Client credentials are malformed");
        }

        int separatorIndex = rawCredentials.indexOf(':');
        if (separatorIndex < 0) {
            throw new BadCredentialsException("Client credentials are malformed");
        }

        String requestedClientId = rawCredentials.substring(0, separatorIndex);
        String requestedClientSecret = rawCredentials.substring(separatorIndex + 1);
        if (!MessageDigest.isEqual(requestedClientId.getBytes(StandardCharsets.UTF_8),
                                   clientId.getBytes(StandardCharsets.UTF_8))
                || !MessageDigest.isEqual(requestedClientSecret.getBytes(StandardCharsets.UTF_8),
                                          clientSecret.getBytes(StandardCharsets.UTF_8))) {
            throw new BadCredentialsException("Client credentials are invalid");
        }
    }

    private String required(MultiValueMap<String, String> parameters, String key) {
        String value = parameters.getFirst(key);
        if (value == null || value.isBlank()) {
            throw new BadRequestException("Missing parameter: " + key);
        }

        return value;
    }
}
