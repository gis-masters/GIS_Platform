package ru.mycrg.gis_service.controller.geoserver;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.geoserver_client.dto.UserGeoserverDto;
import ru.mycrg.gis_service.service.geoserver.UserGeoserverService;

import javax.validation.Valid;

import static ru.mycrg.auth_service_contract.Authorities.SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY;

@RestController
@RequestMapping(value = "/geoserver/users")
public class UserController {

    private final UserGeoserverService userGeoserverService;

    public UserController(UserGeoserverService userGeoserverService) {
        this.userGeoserverService = userGeoserverService;
    }

    @PostMapping
    @PreAuthorize(SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> createUser(@Valid @RequestBody UserGeoserverDto dto) {
        userGeoserverService.create(dto);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    @PreAuthorize(SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> deleteUser(@Valid @RequestBody UserGeoserverDto dto) {
        userGeoserverService.delete(dto);

        return ResponseEntity.noContent().build();
    }
}
