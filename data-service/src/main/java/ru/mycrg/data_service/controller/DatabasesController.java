package ru.mycrg.data_service.controller;

import javax.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import ru.mycrg.data_service.dto.DatabaseCreateDto;
import ru.mycrg.data_service.service.DatabaseService;

@RestController
public class DatabasesController {

    private final DatabaseService databaseService;

    public DatabasesController(DatabaseService databaseService) {
        this.databaseService = databaseService;
    }

    @PreAuthorize("hasAuthority('GLOBAL_ADMIN')")
    @PostMapping("/databases")
    public ResponseEntity<Object> createDb(@Valid @RequestBody DatabaseCreateDto dto) {
        databaseService.create(dto.getName());

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

}
