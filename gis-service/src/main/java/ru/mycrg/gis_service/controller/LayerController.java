package ru.mycrg.gis_service.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.hateoas.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.gis_service.dto.LayerCreateDto;
import ru.mycrg.gis_service.dto.LayerProjection;
import ru.mycrg.gis_service.dto.LayerUpdateDto;
import ru.mycrg.gis_service.service.LayerService;

import javax.validation.Valid;
import java.util.List;

import static ru.mycrg.gis_service.config.Authorities.GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY;

@RestController
@RequestMapping("/projects/{project_id}")
public class LayerController {

    private static Logger log = LoggerFactory.getLogger(LayerController.class);

    private final LayerService layerService;

    public LayerController(LayerService layerService) {
        this.layerService = layerService;
    }

    @GetMapping("/layers")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<?> getLayers(@PathVariable(name = "project_id") long projectId,
                                       Authentication authentication) {
        List<LayerProjection> layers = layerService.findAll(projectId, authentication);

        return ResponseEntity.ok(layers);
    }

    @PostMapping("/layers")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<?> createLayer(@PathVariable(name = "project_id") long projectId,
                                         @Valid @RequestBody LayerCreateDto dto,
                                         Authentication authentication) {
        LayerProjection layerProjection = layerService.create(projectId, dto, authentication);

        return new ResponseEntity(layerProjection, HttpStatus.ACCEPTED);
    }

    @GetMapping("/layers/{layer_id}")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public Resource<LayerProjection> getLayerById(@PathVariable(name = "project_id") long projectId,
                                                  @PathVariable(name = "layer_id") long layerId,
                                                  Authentication authentication) {
        LayerProjection layerProjection = layerService.findById(projectId, layerId, authentication);

        return new Resource<>(layerProjection);
    }

    @PutMapping("/layers/{layer_id}")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public HttpStatus updateLayer(@PathVariable(name = "project_id") long projectId,
                                  @PathVariable(name = "layer_id") long layerId,
                                  @Valid @RequestBody LayerUpdateDto dto,
                                  Authentication authentication) {
        log.debug("update layer: {} To {}", layerId, dto.toString());

        layerService.update(projectId, layerId, dto, authentication);

        return HttpStatus.OK;
    }

    @DeleteMapping("/layers/{layer_id}")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<?> deleteLayer(@PathVariable(name = "project_id") long projectId,
                                         @PathVariable(name = "layer_id") long layerId,
                                         Authentication authentication) {
        log.debug("Request for deletion layer: {}", layerId);

        layerService.delete(projectId, layerId, authentication);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
