package ru.mycrg.data_service.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.dto.TableCreateDto;
import ru.mycrg.data_service.service.resources.ResourceIdentifier;
import ru.mycrg.data_service.service.tables.ITableService;
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

    private final ITableService tableService;

    public TablesController(TableService tableService) {
        this.tableService = tableService;
    }

    @PostMapping("/datasets/{dataSetId}/tables")
    public ResponseEntity<IResourceModel> createTable(@PathVariable String dataSetId,
                                                      @Valid @RequestBody TableCreateDto dto,
                                                      Authentication authentication) {
        ResourceIdentifier datasetId = new ResourceIdentifier(dataSetId, SCHEMA);
        ResourceIdentifier tableId = new ResourceIdentifier(dto.getName(), TABLE, datasetId);

        IResourceModel resourceModel = tableService.create(tableId, dto, authentication);

        return new ResponseEntity<>(resourceModel, CREATED);
    }

    @GetMapping("/datasets/{dataSetId}/tables")
    public ResponseEntity<Object> getTables(@PathVariable String dataSetId,
                                            @RequestParam(required = false, defaultValue = "") String title,
                                            Authentication authentication,
                                            Pageable pageable,
                                            PagedResourcesAssembler<IResourceModel> pageAssembler) {
        final Page<IResourceModel> tables = tableService.getPaged(dataSetId, title, pageable, authentication);

        var pagedResources = pageAssembler.toResource(
                tables,
                linkTo(TablesController.class)
                        .slash("/api/data/datasets/" + dataSetId + "/tables")
                        .withSelfRel());

        return ResponseEntity.ok(pagedResources);
    }

    @GetMapping("/datasets/{dataSetId}/tables/{tableId}")
    public ResponseEntity<Object> getTable(@PathVariable String dataSetId,
                                           @PathVariable String tableId,
                                           Authentication authentication) {
        ResourceIdentifier rIdentifier = new ResourceIdentifier(tableId, TABLE,
                                                                new ResourceIdentifier(dataSetId, SCHEMA));

        final IResourceModel dto = tableService.getByIdentifier(rIdentifier, authentication);

        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/datasets/{dataSetId}/tables/{tableId}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> deleteDataset(@PathVariable String dataSetId,
                                                @PathVariable String tableId,
                                                Authentication authentication) {
        ResourceIdentifier rIdentifier = new ResourceIdentifier(tableId, TABLE,
                                                                new ResourceIdentifier(dataSetId, SCHEMA));

        tableService.delete(rIdentifier, authentication);

        return ResponseEntity.noContent().build();
    }
}
