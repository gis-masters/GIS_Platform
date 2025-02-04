package ru.mycrg.auth_service.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.auth_service.service.PasswordResetService;
import ru.mycrg.auth_service_contract.dto.InitPasswordResetDto;
import ru.mycrg.auth_service_contract.dto.PasswordResetDto;

import javax.validation.Valid;

import static org.springframework.http.HttpStatus.OK;

@RestController
public class PasswordResetController {

    public final Logger log = LoggerFactory.getLogger(PasswordResetController.class);

    private final PasswordResetService passwordResetService;

    public PasswordResetController(PasswordResetService passwordResetService) {
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/request-password-reset")
    public ResponseEntity<Object> initPasswordReset(@Valid @RequestBody InitPasswordResetDto dto) {
        log.debug("Init reset password. For: {}", dto);

        passwordResetService.init(dto);

        return new ResponseEntity<>(OK);
    }

    @PostMapping("/password-reset")
    public ResponseEntity<Object> passwordReset(@Valid @RequestBody PasswordResetDto dto) {
        log.debug("Reset password: {}", dto);

        String login = passwordResetService.activateToken(dto);

        return new ResponseEntity<>(login, OK);
    }

    @GetMapping("/password-reset")
    public ResponseEntity<Object> checkToken(@RequestParam String token) {
        log.debug("Check reset-token: {}", token);

        if (passwordResetService.isExist(token)) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
