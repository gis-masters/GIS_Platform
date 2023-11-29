package ru.mycrg.gis_service.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.hateoas.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.gis_service.dto.LayerCreateDto;
import ru.mycrg.gis_service.dto.LayerProjection;
import ru.mycrg.gis_service.entity.Layer;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service.exceptions.BindingErrorsException;
import ru.mycrg.gis_service.exceptions.ForbiddenException;
import ru.mycrg.gis_service.exceptions.NotFoundException;
import ru.mycrg.gis_service.service.ProjectService;
import ru.mycrg.gis_service.service.ResourceProtector;
import ru.mycrg.gis_service.service.layers.LayerService;
import ru.mycrg.gis_service.validators.CrgLayerValidator;

import javax.json.JsonMergePatch;
import javax.validation.Valid;
import java.util.List;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.common_utils.MediaTypes.APPLICATION_JSON_MERGE_PATCH;

@RestController
@RequestMapping("/projects/{project_id}")
public class LayerController {

    private final Logger log = LoggerFactory.getLogger(LayerController.class);

    private final LayerService layerService;
    private final ProjectService projectService;
    private final CrgLayerValidator validator;
    private final ResourceProtector resourceProtector;

    @InitBinder
    protected void initBinder(WebDataBinder binder) {
        binder.setValidator(validator);
    }

    public LayerController(LayerService layerService,
                           ProjectService projectService,
                           CrgLayerValidator validator,
                           ResourceProtector resourceProtector) {
        this.layerService = layerService;
        this.projectService = projectService;
        this.validator = validator;
        this.resourceProtector = resourceProtector;
    }

    @GetMapping("/layers")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<List<LayerProjection>> getLayers(@PathVariable(name = "project_id") long projectId) {
        List<LayerProjection> layers = layerService.findAll(projectId);

        return ResponseEntity.ok(layers);
    }

    @GetMapping("/layers/{layer_id}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public Resource<LayerProjection> getLayerById(@PathVariable(name = "project_id") long projectId,
                                                  @PathVariable(name = "layer_id") long layerId) {
        LayerProjection layerProjection = layerService.findById(projectId, layerId);

        return new Resource<>(layerProjection);
    }

    @PostMapping("/layers")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<LayerProjection> createLayer(@PathVariable(name = "project_id") long projectId,
                                                       @Valid @RequestBody LayerCreateDto dto,
                                                       BindingResult bindingResult) {
        log.debug("Request create layer: {}", dto);

        if (bindingResult.hasErrors()) {
            throw new BindingErrorsException("Сущность описана некорректно", bindingResult);
        }

        return layerService.create(projectId, dto)
                           .map(layerProjection -> new ResponseEntity<>(layerProjection, HttpStatus.CREATED))
                           .orElseGet(() -> new ResponseEntity<>(null, HttpStatus.CREATED));
    }

    @PatchMapping(path = "/layers/{layer_id}", consumes = APPLICATION_JSON_MERGE_PATCH)
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> updateLayer(@PathVariable(name = "project_id") long projectId,
                                              @PathVariable(name = "layer_id") long layerId,
                                              @RequestBody JsonMergePatch patchDto) {
        log.debug("update layer: {} To: {}", layerId, patchDto.toJsonValue());

        layerService.update(projectId, layerId, patchDto);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/layers/{layer_id}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> deleteLayer(@PathVariable(name = "project_id") long projectId,
                                              @PathVariable(name = "layer_id") long layerId) {
        log.debug("Request for deletion layer: {}", layerId);

        final Project project = projectService.getById(projectId);
        if (!resourceProtector.isOwner(project)) {
            throw new ForbiddenException("редактирования", "проекта", project.getName());
        }

        Layer layer = project
                .getLayers().stream()
                .filter(l -> layerId == l.getId())
                .findFirst()
                .orElseThrow(() -> new NotFoundException(layerId));

        layerService.delete(layer);

        return ResponseEntity.noContent().build();
    }
}
