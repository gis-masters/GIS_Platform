package ru.mycrg.auth_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.auth_service_contract.Authorities;

import java.util.List;

import static ru.mycrg.auth_service_contract.Authorities.SYSTEM_ADMIN_AUTHORITY;

@RestController
@RequestMapping(value = "/roles")
public class AuthoritiesController {

    @GetMapping
    @PreAuthorize(SYSTEM_ADMIN_AUTHORITY)
    public ResponseEntity<List<String>> getAuthorities() {
        return ResponseEntity.ok(Authorities.getAuthorities());
    }
}
