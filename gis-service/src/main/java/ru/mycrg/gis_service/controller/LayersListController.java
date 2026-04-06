package ru.mycrg.gis_service.controller;

import jakarta.validation.constraints.Size;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.gis_service.service.layers.LayerService;
import ru.mycrg.gis_service.validators.CrgLayerValidator;
import ru.mycrg.gis_service_contract.dto.LayerProjection;
import java.util.List;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;

@RestController
public class LayersListController {

    private final Logger log = LoggerFactory.getLogger(LayersListController.class);

    private final LayerService layerService;
    private final CrgLayerValidator layerValidator;

    @InitBinder
    protected void initBinder(WebDataBinder binder) {
        binder.setValidator(layerValidator);
    }

    public LayersListController(LayerService layerService,
                                CrgLayerValidator layerValidator) {
        this.layerService = layerService;
        this.layerValidator = layerValidator;
    }

    @GetMapping("/layers/")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<List<LayerProjection>> getLayersList(@RequestParam("layerIds") @Size(min = 1)
                                                               List<Long> layerIds) {
        log.debug("Количество запрошенных слоёв: {} ", layerIds);

        List<LayerProjection> layerProjection = layerService.getLayersByIds(layerIds);

        return new ResponseEntity<>(layerProjection, HttpStatus.OK);
    }
}
