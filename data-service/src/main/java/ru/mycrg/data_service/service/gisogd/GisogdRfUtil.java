package ru.mycrg.data_service.service.gisogd;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.service.document_library.DocumentLibraryService;
import ru.mycrg.data_service.service.schemas.SchemaService;
import ru.mycrg.data_service.service.resources.TableService;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.dao.config.DaoProperties.GISOGFRF_PUBLICATION_DATETIME;

@Component
public class GisogdRfUtil {

    private final Logger log = LoggerFactory.getLogger(GisogdRfUtil.class);

    private final TableService tableService;
    private final SchemaService schemaService;
    private final DocumentLibraryService dlService;

    public GisogdRfUtil(TableService tableService,
                        SchemaService schemaService,
                        DocumentLibraryService dlService) {
        this.tableService = tableService;
        this.schemaService = schemaService;
        this.dlService = dlService;
    }

    public List<String> getSchemasPreparedForGisogdRf() {
        List<String> result = schemaService.getBySpecificProperty(GISOGFRF_PUBLICATION_DATETIME).stream()
                                           .map(SchemaDto::getName)
                                           .collect(Collectors.toList());
        if (result.isEmpty()) {
            log.warn("Не найдено ГИСОГД РФ схем с полем: {}", GISOGFRF_PUBLICATION_DATETIME);

            return result;
        }

        log.debug("Found {} schemas prepared to publish", result.size());

        return result;
    }

    public List<GisogdData> collectGisogdRfEntities(String schemaId) {
        List<GisogdData> gisogdData = new ArrayList<>();

        try {
            log.debug("Collect by schema: {}", schemaId);

            List<GisogdData> libraryQualifiers = dlService.getLibrariesCreatedBySchema(schemaId);
            log.debug("  Found {} libraries", libraryQualifiers.size());
            gisogdData.addAll(libraryQualifiers);
            List<GisogdData> layerQualifiers = tableService.getTablesCreatedBySchema(schemaId);
            log.debug("  Found {} layers", layerQualifiers.size());
            gisogdData.addAll(layerQualifiers);
        } catch (Exception e) {
            log.error("  Не удалось собрать сущности для публикации, по схеме: [{}]. По причине: {}",
                      schemaId, e.getMessage(), e);
        }

        gisogdData.forEach(data -> {
            if (Objects.isNull(data.getPublishOrder())) {
                data.setPublishOrder(Integer.MAX_VALUE);
            }
        });

        return gisogdData;
    }
}
