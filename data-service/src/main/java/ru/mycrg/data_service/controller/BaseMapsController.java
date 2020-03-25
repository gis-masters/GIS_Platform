package ru.mycrg.data_service.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.data_service.dto.IBaseMap;
import ru.mycrg.data_service.service.BaseMapsService;

import java.util.List;

import static ru.mycrg.data_service.security.CrgClaimsParser.getOrganizationId;
import static ru.mycrg.data_service.security.CrgClaimsParser.isRoot;

@RestController
@RequestMapping("/basemaps")
public class BaseMapsController {

    private final BaseMapsService baseMapsService;

    public BaseMapsController(BaseMapsService baseMapsService) {
        this.baseMapsService = baseMapsService;
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority()")
    public ResponseEntity<Object> getBaseMaps(@RequestParam(name = "orgId", required = false) Long orgId,
                                              @RequestBody List<Long> baseMapsIds,
                                              Authentication authentication) {
        Long organizationId;
        if (isRoot(authentication)) {
            if (orgId == null) {
                return new ResponseEntity<>("Provide organization identifier as 'orgId'", HttpStatus.BAD_REQUEST);
            } else {
                organizationId = orgId;
            }
        } else { // Ignore request orgId in this case
            organizationId = getOrganizationId(authentication);
        }

        List<IBaseMap> baseMaps = baseMapsService.getAll(organizationId, baseMapsIds);

        return ResponseEntity.ok(baseMaps);
    }

}
