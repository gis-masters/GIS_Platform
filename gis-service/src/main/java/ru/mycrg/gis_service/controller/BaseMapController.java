package ru.mycrg.gis_service.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.gis_service.dto.BaseMapCreateDto;
import ru.mycrg.gis_service.dto.BaseMapProjection;
import ru.mycrg.gis_service.service.BasemapService;

import javax.json.JsonMergePatch;
import javax.validation.Valid;
import java.util.List;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.common_utils.MediaTypes.APPLICATION_JSON_MERGE_PATCH;

@RestController
@RequestMapping("/projects/{project_id}")
public class BaseMapController {

    private final Logger log = LoggerFactory.getLogger(BaseMapController.class);

    private final BasemapService baseMapService;

    public BaseMapController(BasemapService baseMapService) {
        this.baseMapService = baseMapService;
    }

    @GetMapping("/basemaps")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<List<BaseMapProjection>> getBaseMaps(@PathVariable(name = "project_id") long projectId) {
        List<BaseMapProjection> baseMaps = baseMapService.getAll(projectId);

        return ResponseEntity.ok(baseMaps);
    }

    @GetMapping("/basemaps/{base_map_id}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<BaseMapProjection> getBaseMaps(@PathVariable(name = "project_id") long projectId,
                                                         @PathVariable(name = "base_map_id") long baseMapId) {
        BaseMapProjection baseMap = baseMapService.findById(projectId, baseMapId);

        return ResponseEntity.ok(baseMap);
    }

    @PostMapping("/basemaps")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<BaseMapProjection> addBaseMap(@PathVariable(name = "project_id") long projectId,
                                                        @Valid @RequestBody BaseMapCreateDto dto) {
        BaseMapProjection baseMap = baseMapService.create(projectId, dto);

        return new ResponseEntity<>(baseMap, HttpStatus.CREATED);
    }

    @PatchMapping(path = "/basemaps/{base_map_id}", consumes = APPLICATION_JSON_MERGE_PATCH)
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> updateBaseMap(@PathVariable(name = "project_id") long projectId,
                                                @PathVariable(name = "base_map_id") long baseMapId,
                                                @RequestBody JsonMergePatch patchDto) {
        log.info("patch update baseMap: {}", patchDto.toJsonValue());

        baseMapService.update(projectId, baseMapId, patchDto);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/basemaps/{id}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> deleteBaseMap(@PathVariable(name = "project_id") long projectId,
                                                @PathVariable(name = "id") long id) {
        baseMapService.delete(projectId, id);

        return ResponseEntity.noContent().build();
    }
}
