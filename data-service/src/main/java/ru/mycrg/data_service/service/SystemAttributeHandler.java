package ru.mycrg.data_service.service;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.security.IAuthenticationFacade;
import ru.mycrg.data_service.util.SystemLibraryAttributes;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.time.LocalDateTime;
import java.util.Map;

import static java.util.Objects.nonNull;
import static ru.mycrg.data_service.config.CrgCommonConfig.ROOT_FOLDER_PATH;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.*;

@Service
public class SystemAttributeHandler {

    private final Logger log = LoggerFactory.getLogger(SystemAttributeHandler.class);

    private final IAuthenticationFacade authenticationFacade;

    private SchemaDto schema;

    public SystemAttributeHandler(IAuthenticationFacade authenticationFacade) {
        this.authenticationFacade = authenticationFacade;
    }

    public SystemAttributeHandler initSchema(@NotNull SchemaDto schema) {
        this.schema = schema;

        return this;
    }

    public SystemAttributeHandler addDefaultPath(@NotNull Map<String, Object> body) {
        if (!body.containsKey(PATH.getName())) {
            body.put(PATH.getName(), ROOT_FOLDER_PATH);
        }

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

    public SystemAttributeHandler fillFileInnerPath(@NotNull Map<String, Object> body, String innerPath) {
        if (attributeDefined(INNER_PATH)) {
            body.put(INNER_PATH.getName(), innerPath);
        }

        return this;
    }

    public SystemAttributeHandler fillByContentType(@NotNull Map<String, Object> content) {
        if (attributeDefined(CONTENT_TYPE_ID)) {
            final String contentTypeId = String.valueOf(content.get(CONTENT_TYPE_ID.getName()));

            schema.getContentTypes().stream()
                  .filter(contentType -> contentType.getId().equals(contentTypeId))
                  .findFirst()
                  .ifPresent(contentType -> {
                      if (contentType.getType().equals("FOLDER")) {
                          content.put(IS_FOLDER.getName(), "true");
                      } else if (contentType.getType().equals("DOCUMENT")) {
                          content.put(IS_FOLDER.getName(), "false");
                      } else {
                          log.warn("Unknown CONTENT_TYPE_ID: {}", contentType.getType());
                      }
                  });
        }

        return this;
    }

    @NotNull
    public String prepareFileName(@NotNull Map<String, Object> body) {
        Object titleObj = body.get(TITLE.getName());

        if (nonNull(titleObj) && !titleObj.toString().isEmpty()) {
            String title = titleObj.toString();

            return addExtensionType(body, title);
        } else {
            Object fileType = body.get(FILE_TYPE.getName());

            return (nonNull(fileType) && !fileType.toString().isEmpty())
                    ? String.format("%s.%s", "unknown", fileType)
                    : "unknown";
        }
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

    private String addExtensionType(Map<String, Object> body, String title) {
        String[] splittedTitle = title.split("\\.");
        if (nonNull(body.get(FILE_TYPE.getName())) && !body.get(FILE_TYPE.getName()).toString().isEmpty()) {
            String extension = body.get(FILE_TYPE.getName()).toString();
            if (splittedTitle.length > 1) {
                String end = splittedTitle[splittedTitle.length - 1];
                String preEnd = splittedTitle[splittedTitle.length - 2];
                if (!extension.equalsIgnoreCase(end)) {
                    return String.format("%s.%s", title, extension);
                } else {
                    if (!end.equalsIgnoreCase(preEnd)) {
                        return title;
                    } else {
                        String doubleExtension = "." + preEnd;

                        return title.replaceFirst(doubleExtension, "");
                    }
                }
            }

            return String.format("%s.%s", title, extension);
        } else {
            return title;
        }
    }
}
