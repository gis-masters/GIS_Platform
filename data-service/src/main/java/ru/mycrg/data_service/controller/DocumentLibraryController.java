package ru.mycrg.data_service.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.service.DocumentLibraryService;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;

@RestController
public class DocumentLibraryController {

    public static final Logger log = LoggerFactory.getLogger(DocumentLibraryController.class);

    private final DocumentLibraryService librariesService;

    public DocumentLibraryController(DocumentLibraryService librariesService) {
        this.librariesService = librariesService;
    }

    @GetMapping("/document-libraries")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> getPagableWithFilter(@RequestParam(required = false, defaultValue = "") String title,
                                                       Authentication authentication,
                                                       Pageable pageable,
                                                       PagedResourcesAssembler<IResourceModel> pageAssembler) {
        final Page<IResourceModel> libraries = librariesService.getPaged(title, pageable, authentication);

        var pagedResources = pageAssembler.toResource(
                libraries,
                linkTo(DatasetsController.class)
                        .slash("/api/data/document-libraries")
                        .withSelfRel());

        return ResponseEntity.ok(pagedResources);
    }

    @GetMapping("/document-libraries/{docLibId}/schema")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public Object getLibrarySchema(@PathVariable String docLibId) {
        return librariesService.getSchema(docLibId);
    }
}
