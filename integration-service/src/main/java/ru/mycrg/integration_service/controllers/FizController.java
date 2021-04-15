package ru.mycrg.integration_service.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.integration_service.security.IAuthenticationFacade;

@RestController
public class FizController {

    @Autowired
    private IAuthenticationFacade authenticationFacade;

    @GetMapping("/some-fiz")
    public ResponseEntity<String> someFiz() {

        return ResponseEntity.ok("Fiz say hello: " + authenticationFacade.getAuthentication().getName());
    }
}
