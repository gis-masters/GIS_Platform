package ru.mycrg.data_service.service.gisogd;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.service.document_library.DocumentLibraryService;
import ru.mycrg.data_service.service.resources.TableService;
import ru.mycrg.data_service.service.schemas.ISchemaTemplateService;
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
    private final ISchemaTemplateService schemaService;
    private final DocumentLibraryService dlService;

    public GisogdRfUtil(TableService tableService,
                        @Qualifier("schemaTemplateServiceBase") ISchemaTemplateService schemaService,
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

        List<GisogdData> libraryQualifiers = List.of();
        try {
            log.debug("Найдем библиотеки для публикации по схеме: {}", schemaId);

            libraryQualifiers = dlService.getLibrariesCreatedBySchema(schemaId);
            log.debug("  Найдено {} библиотек", libraryQualifiers.size());
            gisogdData.addAll(libraryQualifiers);
        } catch (Exception e) {
            log.error("  Не удалось найти библиотеки для публикации, по схеме: [{}]. По причине: {}",
                      schemaId, e.getMessage(), e);
        }

        // Если нашли по схеме библиотеки, то не ищем по этой схеме в слоях.
        // Это не нужно, потому что:
        // Во-первых: на данный момент, считаем что схема либо для библиотеки, либо для таблицы.
        // Во-вторых: если мы пойдем искать таблицу по схеме библиотеки то запрос упадает.
        if (libraryQualifiers.isEmpty()) {
            try {
                log.debug("Найдем таблицы для публикации по схеме: {}", schemaId);

                List<GisogdData> tableQualifiers = tableService.getTablesCreatedBySchema(schemaId);
                log.debug("  Найдено {} таблиц", tableQualifiers.size());
                gisogdData.addAll(tableQualifiers);
            } catch (Exception e) {
                log.error("  Не удалось найти таблицы для публикации, по схеме: [{}]. По причине: {}",
                          schemaId, e.getMessage(), e);
            }
        }

        gisogdData.forEach(data -> {
            if (Objects.isNull(data.getPublishOrder())) {
                data.setPublishOrder(Integer.MAX_VALUE);
            }
        });

        return gisogdData;
    }
}
