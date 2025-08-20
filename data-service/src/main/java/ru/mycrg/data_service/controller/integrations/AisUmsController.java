package ru.mycrg.data_service.controller.integrations;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.data_service.dto.AisUmsModel;
import ru.mycrg.data_service.entity.AisUms;
import ru.mycrg.data_service.service.AisUmsService;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.List;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;
import static ru.mycrg.auth_service_contract.Authorities.SYSTEM_ADMIN_AUTHORITY;

@RestController
@RequestMapping("/integration/ais_ums")
public class AisUmsController {

    private final AisUmsService aisUmsService;

    public AisUmsController(AisUmsService aisUmsService) {
        this.aisUmsService = aisUmsService;
    }

    @PostMapping("/import")
    public ResponseEntity<Object> save(@RequestBody @Valid AisUmsModel aisUmsModel, HttpServletRequest request) {
        final String tokenAisUms = aisUmsService.getTokenAisUms();
        if (!tokenAisUms.equals(request.getHeader("Authorization"))) {
            return new ResponseEntity<>(UNAUTHORIZED);
        }

        List<AisUms> aisUmsSaved = aisUmsService.saveAisUms(aisUmsModel);
        aisUmsService.updateAisUmsColumnsInStpDataset(aisUmsSaved);

        return ResponseEntity.status(CREATED).build();
    }

    @GetMapping
    public ResponseEntity<Object> findAll(Pageable pageable) {
        Page<AisUms> aisUms = aisUmsService.getAll(pageable);

        return ResponseEntity.ok(aisUms);
    }

    @GetMapping("/clean")
    @PreAuthorize(SYSTEM_ADMIN_AUTHORITY)
    public ResponseEntity<Object> cleanDuplicate() {
        aisUmsService.cleanDuplicate();

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/delete")
    @PreAuthorize(SYSTEM_ADMIN_AUTHORITY)
    public ResponseEntity<Object> deleteByDepartment(@RequestParam String departmentName) {
        aisUmsService.deleteAllByDepName(departmentName);

        return ResponseEntity.noContent().build();
    }
}
