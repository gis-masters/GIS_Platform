package ru.mycrg.data_service.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.dto.TableCreateDto;
import ru.mycrg.data_service.service.resources.ResourceIdentifier;
import ru.mycrg.data_service.service.tables.TableService;

import javax.validation.Valid;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.http.HttpStatus.CREATED;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.data_service.dto.ResourceType.SCHEMA;
import static ru.mycrg.data_service.dto.ResourceType.TABLE;

@RestController
public class TablesController {

    public static final Logger log = LoggerFactory.getLogger(TablesController.class);

    private final TableService tableService;

    public TablesController(TableService tableService) {
        this.tableService = tableService;
    }

    @PostMapping("/datasets/{datasetId}/tables")
    public ResponseEntity<IResourceModel> createTable(@PathVariable String datasetId,
                                                      @Valid @RequestBody TableCreateDto dto) {
        ResourceIdentifier tableId = new ResourceIdentifier(dto.getName(), TABLE, datasetId, SCHEMA);

        IResourceModel resourceModel = tableService.create(tableId, dto);

        return new ResponseEntity<>(resourceModel, CREATED);
    }

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

    @GetMapping("/datasets/{datasetId}/tables/{tableId}")
    public ResponseEntity<Object> getTable(@PathVariable String datasetId,
                                           @PathVariable String tableId) {
        ResourceIdentifier rIdentifier = new ResourceIdentifier(tableId, TABLE, datasetId, SCHEMA);

        final IResourceModel dto = tableService.getByIdentifier(rIdentifier);

        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/datasets/{datasetId}/tables/{tableId}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> deleteTable(@PathVariable String datasetId,
                                              @PathVariable String tableId) {
        ResourceIdentifier rIdentifier = new ResourceIdentifier(tableId, TABLE, datasetId, SCHEMA);

        tableService.delete(rIdentifier);

        return ResponseEntity.noContent().build();
    }
}
