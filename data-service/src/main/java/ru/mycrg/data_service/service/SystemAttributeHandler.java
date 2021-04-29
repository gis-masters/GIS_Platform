package ru.mycrg.data_service.service;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.security.IAuthenticationFacade;
import ru.mycrg.data_service.util.SystemLibraryAttributes;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.time.LocalDateTime;
import java.util.Map;

import static ru.mycrg.data_service.util.SystemLibraryAttributes.*;

@Service
public class SystemAttributeHandler {

    private final SchemaService schemaService;
    private final IAuthenticationFacade authenticationFacade;

    private SchemaDto schema;

    public SystemAttributeHandler(SchemaService schemaService,
                                  IAuthenticationFacade authenticationFacade) {
        this.schemaService = schemaService;
        this.authenticationFacade = authenticationFacade;
    }

    public SystemAttributeHandler initSchema(@NotNull String schemaName) {
        schemaService.getSchemaByName(schemaName).ifPresent(schemaDto -> this.schema = schemaDto);

        return this;
    }

    public SystemAttributeHandler fillTimes(@NotNull Map<String, Object> body) {
        if (attributeDefined(CREATED_AT)) {
            body.put(CREATED_AT.getName(), LocalDateTime.now());
        }

        if (attributeDefined(LAST_MODIFIED)) {
            body.put(LAST_MODIFIED.getName(), LocalDateTime.now());
        }

        return this;
    }

    public SystemAttributeHandler fillCreator(@NotNull Map<String, Object> body) {
        if (attributeDefined(CREATED_BY)) {
            body.put(CREATED_BY.getName(), authenticationFacade.getLogin());
        }

        return this;
    }

    public SystemAttributeHandler fillFileInfo(@NotNull Map<String, Object> body, MultipartFile file) {
        if (file != null) {
            if (attributeDefined(SIZE)) {
                body.put(SIZE.getName(), file.getSize());
            }

            if (attributeDefined(FILE_TYPE)) {
                body.put(FILE_TYPE.getName(), StringUtils.getFilenameExtension(file.getOriginalFilename()));
            }
        }

        return this;
    }

    public SystemAttributeHandler fillFileInnerName(@NotNull Map<String, Object> body, String innerFileName) {
        if (attributeDefined(INNER_PATH)) {
            body.put(INNER_PATH.getName(), innerFileName);
        }

        return this;
    }

    @NotNull
    public String getFileName(@NotNull Map<String, Object> body) {
        if (attributeDefined(TITLE)) {
            if (attributeDefined(FILE_TYPE)) {
                return body.get(TITLE.getName()) + "." + body.get(FILE_TYPE.getName());
            }

            return body.get(TITLE.getName()) + ".file";
        }

        return "default.file";
    }

    @NotNull
    public String getFileSize(@NotNull Map<String, Object> body) {
        if (attributeDefined(SIZE)) {
            return body.get(SIZE.getName()).toString();
        }

        return "0";
    }

    private boolean attributeDefined(SystemLibraryAttributes attribute) {
        if (this.schema == null) {
            return false;
        }

        return schema.getProperties().stream()
                     .anyMatch(property -> property.getName().equals(attribute.getName()));
    }
}
