package ru.mycrg.data_service.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import ru.mycrg.data_service.dto.BaseMapCreateDto;
import ru.mycrg.data_service.dto.BaseMapProjection;
import ru.mycrg.data_service.dto.BaseMapUpdateDto;
import ru.mycrg.data_service.entity.BaseMap;
import ru.mycrg.data_service.service.BaseMapService;
import ru.mycrg.data_service.service.cqrs.basemaps.requests.CreateBaseMapRequest;
import ru.mycrg.data_service.service.cqrs.basemaps.requests.DeleteBaseMapRequest;
import ru.mycrg.data_service.service.cqrs.basemaps.requests.UpdateBaseMapRequest;
import ru.mycrg.mediator.Mediator;

import javax.validation.Valid;
import java.net.URI;
import java.util.List;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.auth_service_contract.Authorities.ORG_ADMIN_AUTHORITY;
import static ru.mycrg.common_utils.page.PageHandler.pageFromList;

@Validated
@RestController
public class BaseMapController {

    private final Mediator mediator;
    private final BaseMapService baseMapService;

    public BaseMapController(Mediator mediator,
                             BaseMapService baseMapService) {
        this.mediator = mediator;
        this.baseMapService = baseMapService;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/basemaps")
    public ResponseEntity<Object> getBasemaps(Pageable pageable) {
        Page<BaseMapProjection> basemaps = baseMapService.getPaged(pageable);

        return ResponseEntity.ok(pageFromList(basemaps, pageable));
    }

    @PreAuthorize(ORG_ADMIN_AUTHORITY)
    @GetMapping("/basemaps/{id}")
    public ResponseEntity<Object> getBasemap(@PathVariable Long id) {
        BaseMapProjection baseMap = baseMapService.getById(id);

        return ResponseEntity.ok(baseMap);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/basemaps/search/findByIdIn")
    public ResponseEntity<Object> searchByIds(@RequestParam(name = "ids", required = false) List<Long> ids,
                                              Pageable pageable) {
        Page<BaseMapProjection> basemaps = baseMapService.searchByIds(ids, pageable);

        return ResponseEntity.ok(pageFromList(basemaps, pageable));
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/basemaps/search/findBaseMapByPluggableToNewProjectIsTrue")
    public ResponseEntity<Object> searchPluggableToNewProject() {
        List<BaseMapProjection> result = baseMapService.getPluggableToNewProject();

        return ResponseEntity.ok(result);
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
