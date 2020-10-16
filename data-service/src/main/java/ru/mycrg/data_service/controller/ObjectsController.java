package ru.mycrg.data_service.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.entity.ITableObject;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceInternalException;
import ru.mycrg.data_service.service.FileStorageService;
import ru.mycrg.data_service.service.ObjectService;
import ru.mycrg.data_service.service.TableIdentifier;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.*;

import static ru.mycrg.data_service.config.Authorities.HAS_ANY_AUTHORITY;

@RestController
public class ObjectsController {

    public static final Logger log = LoggerFactory.getLogger(ObjectsController.class);

    private final ObjectService objectService;
    private final FileStorageService fileStorageService;

    private final ObjectMapper mapper = new ObjectMapper();

    public ObjectsController(ObjectService objectService,
                             FileStorageService fileStorageService) {
        this.objectService = objectService;
        this.fileStorageService = fileStorageService;
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @PostMapping("/datasets/{dataSetName}/tables/{tableName}")
    public List<ITableObject> createObject(@PathVariable String dataSetName,
                                           @PathVariable String tableName,
                                           @RequestParam(value = "files", required = false) MultipartFile[] files,
                                           @RequestParam(value = "body", required = false) String jsonBody,
                                           Authentication authentication) {
        try {
            List<ITableObject> objects = new ArrayList<>();

            Map<String, Object> body = deserializeBody(jsonBody);

            final TableIdentifier tableIdentifier = new TableIdentifier(dataSetName, tableName);
            if (files.length > 0) {
                for (MultipartFile file : files) {
                    if (file.isEmpty()) {
                        throw new BadRequestException("File is empty");
                    }

                    ITableObject tableObject = objectService.createObject(tableIdentifier, body, authentication);

                    fileStorageService.storeFile(file, tableObject.getId().toString());

                    objects.add(tableObject);
                }
            } else {
                ITableObject tableObject = objectService.createObject(tableIdentifier, body, authentication);

                objects.add(tableObject);
            }

            return objects;
        } catch (CrgDaoException e) {
            throw new DataServiceInternalException(e.getMessage(), e.getCause());
        }
    }

    @GetMapping("/datasets/{dataSetName}/tables/{tableName}/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable String dataSetName,
                                                       @PathVariable String tableName,
                                                       @PathVariable UUID id,
                                                       Authentication authentication) {
        Map<String, Object> entity = objectService
                .getById(new TableIdentifier(dataSetName, tableName), id, authentication);

        return ResponseEntity.ok(entity);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @DeleteMapping("/datasets/{dataSetName}/tables/{tableName}/{id}")
    public ResponseEntity<Object> delete(@PathVariable String dataSetName,
                                         @PathVariable String tableName,
                                         @PathVariable UUID id,
                                         Authentication authentication) {
        final TableIdentifier tableIdentifier = new TableIdentifier(dataSetName, tableName);

        fileStorageService.removeFile(id.toString());
        objectService.deleteObject(tableIdentifier, id, authentication);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PreAuthorize(HAS_ANY_AUTHORITY)
    @GetMapping("/datasets/{dataSetName}/tables/{tableName}/{id}/download")
    public ResponseEntity<Resource> downloadBinary(@PathVariable String dataSetName,
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
