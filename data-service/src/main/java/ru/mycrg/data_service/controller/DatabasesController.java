package ru.mycrg.data_service.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.data_service.dto.DatabaseCreateDto;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.DatabaseService;

import javax.validation.Valid;

import static org.springframework.http.HttpStatus.OK;
import static ru.mycrg.auth_service_contract.Authorities.SYSTEM_ADMIN_AUTHORITY;
import static ru.mycrg.auth_service_contract.Authorities.SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY;

@RestController
public class DatabasesController {

    private final DatabaseService databaseService;

    public DatabasesController(DatabaseService databaseService) {
        this.databaseService = databaseService;
    }

    @GetMapping("/databases/{dbName}")
    @PreAuthorize(SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<DatabaseCreateDto> getDb(@PathVariable String dbName) {
        if (databaseService.isExist(dbName)) {
            return ResponseEntity.status(OK).body(new DatabaseCreateDto(dbName));
        }

        throw new NotFoundException(dbName);
    }

    @PreAuthorize(SYSTEM_ADMIN_AUTHORITY)
    @PostMapping("/databases")
    public ResponseEntity<Object> createDb(@Valid @RequestBody DatabaseCreateDto dto) {
        databaseService.create(dto.getName());

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PreAuthorize(SYSTEM_ADMIN_AUTHORITY)
    @DeleteMapping("/databases/{dbName}")
    public ResponseEntity<Object> deleteDb(@PathVariable String dbName) {
        databaseService.delete(dbName);

        return ResponseEntity.noContent().build();
    }
}
