package ru.mycrg.data_service.controller;

import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import ru.mycrg.data_service.dto.BaseMapCreateDto;
import ru.mycrg.data_service.dto.BaseMapUpdateDto;
import ru.mycrg.data_service.entity.BaseMap;
import ru.mycrg.data_service.service.cqrs.basemaps.requests.CreateBaseMapRequest;
import ru.mycrg.data_service.service.cqrs.basemaps.requests.DeleteBaseMapRequest;
import ru.mycrg.data_service.service.cqrs.basemaps.requests.UpdateBaseMapRequest;
import ru.mycrg.mediator.Mediator;

import javax.validation.Valid;
import java.net.URI;

import static ru.mycrg.auth_service_contract.Authorities.ORG_ADMIN_AUTHORITY;

@Validated
@RepositoryRestController
public class BasemapsController {

    private final Mediator mediator;

    public BasemapsController(Mediator mediator) {
        this.mediator = mediator;
    }

    @PreAuthorize(ORG_ADMIN_AUTHORITY)
    @PostMapping("/basemaps")
    public ResponseEntity<Object> createBasemap(@Valid @RequestBody BaseMapCreateDto basemap) {
        BaseMap baseMap = mediator.execute(new CreateBaseMapRequest(basemap));

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/basemaps/{basemapsId}")
                .buildAndExpand(baseMap.getId())
                .toUri();

        return ResponseEntity.created(location).body(basemap);
    }

    @PreAuthorize(ORG_ADMIN_AUTHORITY)
    @PatchMapping("/basemaps/{id}")
    public ResponseEntity<Object> updateBasemap(@PathVariable Long id,
                                                @Valid @RequestBody BaseMapUpdateDto basemap) {

        mediator.execute(new UpdateBaseMapRequest(id, basemap));

        return ResponseEntity.noContent().build();
    }

    @PreAuthorize(ORG_ADMIN_AUTHORITY)
    @DeleteMapping("/basemaps/{id}")
    public ResponseEntity<Object> deleteBasemap(@PathVariable Long id) {

        mediator.execute(new DeleteBaseMapRequest(id));

        return ResponseEntity.noContent().build();
    }
}
