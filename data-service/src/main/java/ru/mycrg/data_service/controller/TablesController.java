package ru.mycrg.data_service.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.dto.TableCreateDto;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.TableService;

import javax.validation.Valid;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.http.HttpStatus.CREATED;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;

@RestController
public class TablesController {

    private final TableService tableService;

    public TablesController(TableService tableService) {
        this.tableService = tableService;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping("/datasets/{datasetId}/tables")
    public ResponseEntity<IResourceModel> createTable(@PathVariable String datasetId,
                                                      @Valid @RequestBody TableCreateDto dto) {
        ResourceQualifier tQualifier = new ResourceQualifier(datasetId, dto.getName());

        IResourceModel resourceModel = tableService.create(tQualifier, dto);

        return new ResponseEntity<>(resourceModel, CREATED);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/datasets/{datasetId}/tables")
    public ResponseEntity<Object> getTables(@PathVariable String datasetId,
                                            @RequestParam(required = false, defaultValue = "") String title,
                                            Pageable pageable,
                                            PagedResourcesAssembler<IResourceModel> pageAssembler) {
        final Page<IResourceModel> tables = tableService.getPaged(datasetId, title, pageable);

        var pagedResources = pageAssembler.toResource(
                tables,
                linkTo(TablesController.class)
                        .slash("/api/data/datasets/" + datasetId + "/tables")
                        .withSelfRel());

        return ResponseEntity.ok(pagedResources);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/datasets/{datasetId}/tables/{tableId}")
    public ResponseEntity<Object> getTable(@PathVariable String datasetId,
                                           @PathVariable String tableId) {
        ResourceQualifier tQualifier = new ResourceQualifier(datasetId, tableId);

        final IResourceModel dto = tableService.getInfo(tQualifier);

        return ResponseEntity.ok(dto);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @DeleteMapping("/datasets/{datasetId}/tables/{tableId}")
    public ResponseEntity<Object> deleteTable(@PathVariable String datasetId,
                                              @PathVariable String tableId) {
        ResourceQualifier rQualifier = new ResourceQualifier(datasetId, tableId);

        tableService.delete(rQualifier);

        return ResponseEntity.noContent().build();
    }
}
