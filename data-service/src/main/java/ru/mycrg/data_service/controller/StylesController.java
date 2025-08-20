package ru.mycrg.data_service.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.data_service.dto.styles.ActualStylesRequestModel;
import ru.mycrg.data_service.dto.styles.ActualStylesResponseModel;
import ru.mycrg.data_service.service.StylesService;

import java.util.List;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.data_service.validators.ActualStyleRequestModelValidator.throwIfNotValid;

@RestController
public class StylesController {

    private final Logger log = LoggerFactory.getLogger(StylesController.class);

    private final StylesService stylesService;

    public StylesController(StylesService stylesService) {
        this.stylesService = stylesService;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping("/styles/actual")
    public ResponseEntity<Object> getActualStyles(@RequestBody List<ActualStylesRequestModel> styles) {
        log.debug("getActualStyles: '{}'", styles);

        throwIfNotValid(styles);

        List<ActualStylesResponseModel> response = stylesService.defineActualStyles(styles);

        return ResponseEntity.ok().body(response);
    }
}
