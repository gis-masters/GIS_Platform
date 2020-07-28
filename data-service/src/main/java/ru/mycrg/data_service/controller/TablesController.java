package ru.mycrg.data_service.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.log4j.Log4j2;
import org.jetbrains.annotations.Nullable;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dto.TableDto;
import ru.mycrg.data_service.entity.ITableObject;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceInternalException;
import ru.mycrg.data_service.service.FileStorageService;
import ru.mycrg.data_service.service.TableIdentifier;
import ru.mycrg.data_service.service.TableService;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.*;

import static ru.mycrg.data_service.config.Authorities.HAS_ANY_AUTHORITY;

@Log4j2
@RestController
public class TablesController {

    private final TableService tableService;
    private final FileStorageService fileStorageService;
    private final ObjectMapper mapper = new ObjectMapper();

    public TablesController(TableService tableService,
                            FileStorageService fileStorageService) {
        this.tableService = tableService;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping("/schemas/{schemaName}/tables")
    public ResponseEntity<Object> getTablesInfo(@PathVariable String schemaName,
                                                Authentication authentication,
                                                Pageable pageable) {
        Page<TableDto> tables = tableService.getTables(schemaName, authentication, pageable);

        return ResponseEntity.ok(tables);
    }

    @GetMapping("/schemas/{schemaName}/tables/{tableName}")
    public ResponseEntity<Object> getTableInfo(@PathVariable String schemaName,
                                               @PathVariable String tableName,
                                               Authentication authentication) {
        TableDto byName = tableService.getByName(new TableIdentifier(schemaName, tableName), authentication);

        return ResponseEntity.ok(byName);
    }

    @GetMapping("/schemas/{schemaName}/tables/{tableName}/{id}")
    public ResponseEntity<LinkedHashMap> getById(@PathVariable String schemaName,
                                                 @PathVariable String tableName,
                                                 @PathVariable UUID id,
                                                 Authentication authentication) {
        LinkedHashMap entity = tableService.getById(new TableIdentifier(schemaName, tableName), id, authentication);

        return ResponseEntity.ok(entity);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping("/schemas/{schemaName}/tables/{tableName}")
    public List<ITableObject> createSomething(@PathVariable String schemaName,
                                              @PathVariable String tableName,
                                              @RequestParam(value = "files", required = false) MultipartFile[] files,
                                              @RequestParam(value = "body", required = false) String jsonBody,
                                              Authentication authentication) {
        try {
            List<ITableObject> objects = new ArrayList<>();

            Map<String, Object> body = deserializeBody(jsonBody);

            final TableIdentifier tableIdentifier = new TableIdentifier(schemaName, tableName);
            if (files.length > 0) {
                for (MultipartFile file : files) {
                    if (file.isEmpty()) {
                        throw new BadRequestException("File is empty");
                    }

                    ITableObject tableObject = tableService.createObject(tableIdentifier, body, authentication);

                    fileStorageService.storeFile(file, tableObject.getId().toString());

                    objects.add(tableObject);
                }
            } else {
                ITableObject tableObject = tableService.createObject(tableIdentifier, body, authentication);

                objects.add(tableObject);
            }

            return objects;
        } catch (CrgDaoException e) {
            throw new DataServiceInternalException(e.getMessage(), e.getCause());
        }
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @DeleteMapping("/schemas/{schemaName}/tables/{tableName}/{id}")
    public ResponseEntity<Object> delete(@PathVariable String schemaName,
                                         @PathVariable String tableName,
                                         @PathVariable UUID id,
                                         Authentication authentication) {
        final TableIdentifier tableIdentifier = new TableIdentifier(schemaName, tableName);

        fileStorageService.removeFile(id.toString());
        tableService.deleteObject(tableIdentifier, id, authentication);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/schemas/{schemaName}/tables/{tableName}/{id}/download")
    public ResponseEntity<Resource> downloadBinary(@PathVariable String schemaName,
                                                   @PathVariable String tableName,
                                                   @PathVariable UUID id,
                                                   HttpServletRequest request,
                                                   Authentication authentication) {
        Resource resource = fileStorageService.loadFileAsResource(id.toString());

        // Try to determine file's content type
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException e) {
            log.warn("Could not determine file type.");
        }

        // Fallback to the default content type if type could not be determined
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, String.format("attachment; filename=\"%s\"",
                        resource.getFilename()))
                .body(resource);
    }

    private Map<String, Object> deserializeBody(@Nullable String jsonString) {
        try {
            if (jsonString == null) {
                return new LinkedHashMap<>();
            }

            return mapper.readValue(jsonString, LinkedHashMap.class);
        } catch (IOException e) {
            throw new BadRequestException("Incorrect body: " + jsonString);
        }
    }

}
