package ru.mycrg.data_service.service.export;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.ValidationResultRepository;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dto.ExportResourceModel;
import ru.mycrg.data_service.dto.Record;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.CsvHandler;
import ru.mycrg.data_service.service.SchemaService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.util.SchemaHandler;
import ru.mycrg.data_service.util.filter.CrgFilter;
import ru.mycrg.data_service.util.filter.FilterCondition;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import static java.util.Objects.nonNull;
import static ru.mycrg.data_service.service.JsonConverter.toJsonNodeFromString;

@Service
public class LayerValidationReportService {

    public static final Logger log = LoggerFactory.getLogger(LayerValidationReportService.class);

    private static final String EXTENSION = "_extension";
    private static final Integer PAGE_SIZE = 100;

    private final String EXPORT_STORAGE_PATH;
    private final String[] header;

    private CsvHandler csvHandler;

    private final SchemaService schemaService;
    private final SchemaHandler schemaHandler;
    private final ValidationResultRepository validationResult;

    public LayerValidationReportService(SchemaService schemaService,
                                        SchemaHandler schemaHandler,
                                        ValidationResultRepository validationResult,
                                        Environment environment) {
        this.schemaService = schemaService;
        this.schemaHandler = schemaHandler;
        this.validationResult = validationResult;
        EXPORT_STORAGE_PATH = environment.getRequiredProperty("crg-options.exportStoragePath");

        header = new String[]{" Класс объектов", " Объект класса", " Идентификатор объекта(GLOBALID)", " Имя атрибута",
                " Значение", " Описание ошибки"};
    }

    public String generateReport(List<ExportResourceModel> resources) {
        String fileName = initFileName();

        try {
            csvHandler = new CsvHandler(EXPORT_STORAGE_PATH + fileName, header);
            resources.forEach(this::handleResource);
        } catch (IOException e) {
            log.error("Не удалось создать соединение: {}", e.getMessage());
            throw new DataServiceException("Что-то пошло не так.");
        } finally {
            csvHandler.close();
        }

        return fileName;
    }

    private void handleResource(ExportResourceModel resource) {
        try {
            String schemaName = resource.getSchemaId();
            Optional<SchemaDto> oSchemaDto = schemaService.getSchemaByName(schemaName);
            if (oSchemaDto.isEmpty()) {
                csvHandler.append(
                        new String[]{"", "", resource.toString(), "", "не обработан", schemaName + " не найдена"});

                return;
            }

            ResourceQualifier rQualifier = new ResourceQualifier(resource.getDataset(),
                                                                 resource.getTable() + EXTENSION);
            CrgFilter crgFilter = new CrgFilter();
            crgFilter.addFilter("valid", "false", FilterCondition.EQUAL_TO);
            long countPage = (validationResult.getTotal(rQualifier, crgFilter) + PAGE_SIZE - 1) / PAGE_SIZE;

            for (int i = 0; i < countPage; i++) {
                Pageable pageable = PageRequest.of(i, PAGE_SIZE);

                validationResult
                        .findPagedByFilter(rQualifier, pageable, crgFilter).stream()
                        .map(this::extractViolations)
                        .forEach(violations -> writeViolations(violations, oSchemaDto.get()));
            }
        } catch (CrgDaoException e) {
            csvHandler.append(new String[]{"", "", resource.toString(), "", "не обработан", e.getMessage()});
        }
    }

    private void writeViolations(JsonNode violationNode, SchemaDto schemaDto) {
        final String propertyName = "CLASSID";
        final String schemaTitle = schemaDto.getTitle();
        final String objectId = violationNode.get("globalId").asText();

        String objectClass;
        Optional<SimplePropertyDto> oProperty = schemaHandler.getPropertyByName(schemaDto, propertyName);
        if (oProperty.isEmpty()) {
            objectClass = propertyName;
        } else {
            String classIdValue = violationNode.get("classId").asText();
            objectClass = schemaHandler.getEnumerationTitleByValue(oProperty.get(), classIdValue);
        }

        JsonNode objectsViolationsNode = violationNode.get("objectViolations");
        if (nonNull(objectsViolationsNode)) {
            objectsViolationsNode.forEach(obViolation -> {
                String error = obViolation.get("error").asText();
                String attributeName = obViolation.get("attribute").asText();

                csvHandler.append(
                        new String[]{objectClass, schemaTitle, objectId, attributeName, "", prepareErrorMsg(error)
                        });
            });
        }

        JsonNode propertyViolations = violationNode.get("propertyViolations");
        if (nonNull(propertyViolations)) {
            propertyViolations.forEach(propertyViolation -> {
                String name = propertyViolation.get("name").asText();
                String value = propertyViolation.get("value").asText();

                propertyViolation.get("errorTypes")
                                 .forEach(errorType -> {
                                     csvHandler.append(
                                             new String[]{objectClass, schemaTitle, objectId,
                                                     name, prepareValue(value), prepareErrorMsg(errorType.asText())});
                                 });
            });
        }
    }

    private JsonNode extractViolations(Record record) {
        return toJsonNodeFromString((String) record.getContent().get("violations"));
    }

    private String prepareValue(String value) {
        if (value.isBlank() || "null".equals(value)) {
            value = "значение отсутствует";
        }

        return value;
    }

    private String prepareErrorMsg(String errorType) {
        if (errorType.startsWith("required")) {
            return "Параметр обязателен к заполнению";
        }

        if (errorType.startsWith("minLength")) {
            return "Строка слишком короткая";
        }

        if (errorType.startsWith("maxLength")) {
            return "Значение превышает допустимый максимум";
        }

        if (errorType.startsWith("pattern")) {
            return "Строка не соответствует паттерну";
        }

        if (errorType.startsWith("enumeration")) {
            return "Значение не соответствует справочному";
        }

        if (errorType.startsWith("notDoubleType")) {
            return "Значение не является дробным числом";
        }

        if (errorType.startsWith("notLongType")) {
            return "Значение не является целым числом";
        }

        if (errorType.startsWith("maxInclusive")) {
            return "Значение превышает допустимый максимум";
        }

        if (errorType.startsWith("totalDigits")) {
            return "Превышено допустимое кол-во знаков";
        } else {
            log.warn("Заданный errorType: {} не найден", errorType);
        }

        return errorType;
    }

    public String initFileName() {
        //TODO формирование рандомного имени, и после скачивания удалять файл
        return "validation.csv";
    }
}
