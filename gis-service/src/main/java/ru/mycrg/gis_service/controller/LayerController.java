package ru.mycrg.gis_service.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.hateoas.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.gis_service.dto.LayerCreateDto;
import ru.mycrg.gis_service.dto.LayerProjection;
import ru.mycrg.gis_service.exceptions.BindingErrorsException;
import ru.mycrg.gis_service.service.layers.LayerService;
import ru.mycrg.gis_service.validators.CrgLayerValidator;

import javax.json.JsonMergePatch;
import javax.validation.Valid;
import java.util.List;

import static org.springframework.http.HttpStatus.CREATED;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.common_utils.MediaTypes.APPLICATION_JSON_MERGE_PATCH;

@RestController
@RequestMapping("/projects/{projectId}")
public class LayerController {

    private final Logger log = LoggerFactory.getLogger(LayerController.class);

    private final LayerService layerService;
    private final CrgLayerValidator layerValidator;

    @InitBinder
    protected void initBinder(WebDataBinder binder) {
        binder.setValidator(layerValidator);
    }

    public LayerController(LayerService layerService,
                           CrgLayerValidator layerValidator) {
        this.layerService = layerService;
        this.layerValidator = layerValidator;
    }

    @GetMapping("/layers")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<List<LayerProjection>> getLayers(@PathVariable(name = "projectId") long projectId) {
        List<LayerProjection> layers = layerService.getAll(projectId);

        return ResponseEntity.ok(layers);
    }

    @GetMapping("/layers/{layerId}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public Resource<LayerProjection> getLayerById(@PathVariable(name = "projectId") long projectId,
                                                  @PathVariable(name = "layerId") long layerId) {
        LayerProjection layerProjection = layerService.getById(projectId, layerId);

        return new Resource<>(layerProjection);
    }

    @PostMapping("/layers")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<LayerProjection> createLayer(@PathVariable(name = "projectId") long projectId,
                                                       @Valid @RequestBody LayerCreateDto dto,
                                                       BindingResult bindingResult) {
        log.debug("Request create layer: {}", dto);

        if (bindingResult.hasErrors()) {
            throw new BindingErrorsException("Сущность описана некорректно", bindingResult);
        }

        return layerService.create(projectId, dto)
                           .map(layerProjection -> new ResponseEntity<>(layerProjection, CREATED))
                           .orElseGet(() -> new ResponseEntity<>(null, CREATED));
    }

    @PatchMapping(path = "/layers/{layerId}", consumes = APPLICATION_JSON_MERGE_PATCH)
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> updateLayer(@PathVariable(name = "projectId") long projectId,
                                              @PathVariable(name = "layerId") long layerId,
                                              @RequestBody JsonMergePatch patchDto) {
        log.debug("update layer: {} To: {}", layerId, patchDto.toJsonValue());

        layerService.update(projectId, layerId, patchDto);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/layers/{layerId}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> deleteLayer(@PathVariable(name = "projectId") long projectId,
                                              @PathVariable(name = "layerId") long layerId) {
        log.debug("Request for deletion layer: {}", layerId);

        layerService.delete(projectId, layerId);

        return ResponseEntity.noContent().build();
    }
}
