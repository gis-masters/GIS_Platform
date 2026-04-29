package ru.mycrg.auth_service.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.auth_service.entity.PasswordResetToken;
import ru.mycrg.auth_service.repository.PasswordResetTokenRepository;

import java.util.Comparator;

import static org.springframework.http.HttpStatus.METHOD_NOT_ALLOWED;

@RestController
public class PasswordResetTokenController {

    public final Logger log = LoggerFactory.getLogger(PasswordResetTokenController.class);

    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final boolean passwordResetTokenEndpointEnabled;

    public PasswordResetTokenController(PasswordResetTokenRepository passwordResetTokenRepository,
                                        @Value("${crg-options.password-reset-token-endpoint-enabled:false}")
                                        boolean passwordResetTokenEndpointEnabled) {
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.passwordResetTokenEndpointEnabled = passwordResetTokenEndpointEnabled;
    }

    @GetMapping("/password-reset-token/{userId}")
    public ResponseEntity<Object> getPasswordResetToken(@PathVariable Long userId) {
        log.debug("Зашли в контроллер просмотра токенов");

        if (!passwordResetTokenEndpointEnabled) {
            log.debug("Контроллер выключен");
            return ResponseEntity.status(METHOD_NOT_ALLOWED).build();
        }

        return passwordResetTokenRepository.findAllByUser_Id(userId)
                                           .stream()
                                           .max(Comparator.comparing(PasswordResetToken::getId))
                                           .map(PasswordResetToken::getToken)
                                           .<ResponseEntity<Object>>map(ResponseEntity::ok)
                                           .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
