package ru.mycrg.gis_service.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.gis_service.dto.project.ProjectProjection;
import ru.mycrg.gis_service.dto.RelatedLayersModel;
import ru.mycrg.gis_service.exceptions.BadRequestException;
import ru.mycrg.gis_service.exceptions.ErrorInfo;
import ru.mycrg.gis_service.service.BasemapService;
import ru.mycrg.gis_service.service.layers.LayerService;

import java.util.List;
import java.util.UUID;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;

@RestController
@RequestMapping(value = "/projects")
public class RelatedObjectsController {

    private final LayerService layerService;
    private final BasemapService basemapService;

    public RelatedObjectsController(LayerService layerService,
                                    BasemapService basemapService) {
        this.layerService = layerService;
        this.basemapService = basemapService;
    }

    @GetMapping("/find-related-layers")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public List<RelatedLayersModel> findRelatedLayers(@RequestParam("field") String field,
                                                      @RequestParam("value") String value) {
        if (value.isEmpty()) {
            throw new BadRequestException("Required String parameter 'value' is not present",
                                          new ErrorInfo("value", "value parameter is empty"));
        }

        return layerService.getRelatedLayers(field, value);
    }

    @GetMapping("/find-related-to-file-layers")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public List<RelatedLayersModel> findRelatedToFilesProjectsAndLayers(@RequestParam("fileId") UUID fileId) {
        return layerService.getRelatedToFilesLayers(fileId);
    }

    @GetMapping("/find-related-by-basemap/{sourceBasemapId}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public List<ProjectProjection> findRelatedProjects(@PathVariable(name = "sourceBasemapId") long sourceBasemapId) {
        return basemapService.findRelatedProjects(sourceBasemapId);
    }
}
