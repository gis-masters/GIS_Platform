package ru.mycrg.gis_service.controller;

import lombok.extern.log4j.Log4j2;
import org.springframework.hateoas.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.gis_service.dto.LayerCreateDto;
import ru.mycrg.gis_service.dto.LayerProjection;
import ru.mycrg.gis_service.entity.Layer;
import ru.mycrg.gis_service.exceptions.BindingErrorsException;
import ru.mycrg.gis_service.exceptions.NotFoundException;
import ru.mycrg.gis_service.service.LayerService;
import ru.mycrg.gis_service.service.ProjectService;
import ru.mycrg.gis_service.validators.CrgLayerValidator;

import javax.json.JsonMergePatch;
import javax.validation.Valid;
import java.util.List;

import static ru.mycrg.gis_service.config.Authorities.GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY;
import static ru.mycrg.gis_service.config.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.gis_service.config.MediaTypes.APPLICATION_JSON_MERGE_PATCH;

@Log4j2
@RestController
@RequestMapping("/projects/{project_id}")
public class LayerController {

    private final LayerService layerService;
    private final ProjectService projectService;
    private final CrgLayerValidator validator;

    @InitBinder
    protected void initBinder(WebDataBinder binder) {
        binder.setValidator(validator);
    }

    public LayerController(LayerService layerService,
                           ProjectService projectService,
                           CrgLayerValidator validator) {
        this.layerService = layerService;
        this.projectService = projectService;
        this.validator = validator;
    }

    @GetMapping("/layers")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<List<LayerProjection>> getLayers(@PathVariable(name = "project_id") long projectId,
                                                           Authentication authentication) {
        List<LayerProjection> layers = layerService.findAll(projectId, authentication);

        return ResponseEntity.ok(layers);
    }

    @PostMapping("/layers")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<LayerProjection> createLayer(@PathVariable(name = "project_id") long projectId,
                                                       @Valid @RequestBody LayerCreateDto dto,
                                                       BindingResult bindingResult,
                                                       Authentication authentication) {
        if (bindingResult.hasErrors()) {
            throw new BindingErrorsException("Сущность описана некорректно", bindingResult);
        }

        LayerProjection layerProjection = layerService.create(projectId, dto, authentication);

        return new ResponseEntity<>(layerProjection, HttpStatus.CREATED);
    }

    @GetMapping("/layers/{layer_id}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public Resource<LayerProjection> getLayerById(@PathVariable(name = "project_id") long projectId,
                                                  @PathVariable(name = "layer_id") long layerId,
                                                  Authentication authentication) {
        LayerProjection layerProjection = layerService.findById(projectId, layerId, authentication);

        return new Resource<>(layerProjection);
    }

    @PatchMapping(path = "/layers/{layer_id}", consumes = APPLICATION_JSON_MERGE_PATCH)
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public HttpStatus updateLayer(@PathVariable(name = "project_id") long projectId,
                                  @PathVariable(name = "layer_id") long layerId,
                                  @RequestBody JsonMergePatch patchDto,
                                  Authentication authentication) {
        log.debug("update layer: {} To: {}", layerId, patchDto.toJsonValue());

        layerService.update(projectId, layerId, patchDto, authentication);

        return HttpStatus.NO_CONTENT;
    }

    @DeleteMapping("/layers/{layer_id}")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Void> deleteLayer(@PathVariable(name = "project_id") long projectId,
                                            @PathVariable(name = "layer_id") long layerId,
                                            Authentication authentication) {
        log.debug("Request for deletion layer: {}", layerId);

        Layer layer = projectService.getById(projectId, authentication)
                .getLayers().stream()
                .filter(l -> layerId == l.getId())
                .findFirst()
                .orElseThrow(() -> new NotFoundException(layerId));

        layerService.delete(layer, projectId, authentication);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
