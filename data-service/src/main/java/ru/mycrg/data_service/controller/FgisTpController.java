package ru.mycrg.data_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.data_service_contract.dto.FgisTpDocument;

import java.util.Map;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;

@RestController
public class FgisTpController {

    private final Map<String, FgisTpDocument> fgisTpDocuments;

    public FgisTpController(Map<String, FgisTpDocument> fgisTpDocuments) {
        this.fgisTpDocuments = fgisTpDocuments;
    }

    @GetMapping("/fgistp-doc-schemas")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> getAll() {
        return ResponseEntity.ok(fgisTpDocuments);
    }
}
