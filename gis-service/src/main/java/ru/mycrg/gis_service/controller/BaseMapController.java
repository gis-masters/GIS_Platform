package ru.mycrg.gis_service.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.gis_service.dto.BaseMapCreateDto;
import ru.mycrg.gis_service.dto.BaseMapProjection;
import ru.mycrg.gis_service.service.BaseMapService;

import javax.json.JsonMergePatch;
import javax.validation.Valid;
import java.util.List;

import static ru.mycrg.gis_service.config.Authorities.GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY;
import static ru.mycrg.gis_service.config.MediaTypes.APPLICATION_JSON_MERGE_PATCH;

@RestController
@RequestMapping("/projects/{project_id}")
public class BaseMapController {

    private static Logger log = LoggerFactory.getLogger(BaseMapController.class);

    private final BaseMapService baseMapService;

    public BaseMapController(BaseMapService baseMapService) {
        this.baseMapService = baseMapService;
    }

    @GetMapping("/basemaps")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<List<BaseMapProjection>> getBaseMaps(@PathVariable(name = "project_id") long projectId,
                                                               Authentication authentication) {
        List<BaseMapProjection> baseMaps = baseMapService.getAll(projectId, authentication);

        return ResponseEntity.ok(baseMaps);
    }

    @GetMapping("/basemaps/{base_map_id}")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<BaseMapProjection> getBaseMaps(@PathVariable(name = "project_id") long projectId,
                                                               @PathVariable(name = "base_map_id") long baseMapId,
                                                               Authentication authentication) {
        BaseMapProjection baseMap = baseMapService.findById(projectId, baseMapId, authentication);

        return ResponseEntity.ok(baseMap);
    }

    @PostMapping("/basemaps")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public HttpStatus addBaseMap(@PathVariable(name = "project_id") long projectId,
                                 @Valid @RequestBody BaseMapCreateDto dto,
                                 Authentication authentication) {
        baseMapService.create(projectId, dto, authentication);

        return HttpStatus.CREATED;
    }

    @PatchMapping(path = "/basemaps/{base_map_id}", consumes = APPLICATION_JSON_MERGE_PATCH)
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public HttpStatus updateBaseMap(@PathVariable(name = "project_id") long projectId,
                                    @PathVariable(name = "base_map_id") long baseMapId,
                                    @RequestBody JsonMergePatch patchDto,
                                    Authentication authentication) {
        log.info("patch update baseMap: {}", patchDto.toJsonValue());

        baseMapService.update(projectId, baseMapId, patchDto, authentication);

        return HttpStatus.NO_CONTENT;
    }

    @DeleteMapping("/basemaps")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public HttpStatus deleteBaseMap(@PathVariable(name = "project_id") long projectId,
                                    @RequestParam(name = "baseMapId") long baseMapId,
                                    Authentication authentication) {
        baseMapService.delete(projectId, baseMapId, authentication);

        return HttpStatus.NO_CONTENT;
    }

}
