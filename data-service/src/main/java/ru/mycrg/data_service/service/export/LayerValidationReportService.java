package ru.mycrg.data_service.service.export;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.DatasourceFactory;
import ru.mycrg.data_service.dao.ValidationResultRepository;
import ru.mycrg.data_service.dto.ExportResourceModel;
import ru.mycrg.data_service.dto.Record;
import ru.mycrg.data_service.dto.ValidationRequestDto;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service.security.AuthenticationFacade;
import ru.mycrg.data_service.service.CsvHandler;
import ru.mycrg.data_service.service.JsonConverter;
import ru.mycrg.data_service.service.ProcessService;
import ru.mycrg.data_service.service.SchemaService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.util.SchemaHandler;
import ru.mycrg.data_service.util.filter.CrgFilter;
import ru.mycrg.data_service.util.filter.FilterCondition;
import ru.mycrg.data_service_contract.dto.ResourceReport;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.dto.ValidationReportModel;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

import static java.util.Objects.nonNull;
import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;
import static ru.mycrg.data_service.dao.TablesManager.EXTENSION_POSTFIX;
import static ru.mycrg.data_service.service.JsonConverter.toJsonNodeFromString;
import static ru.mycrg.data_service_contract.enums.ProcessType.VALIDATION_REPORT;

@Service
public class LayerValidationReportService {

    public static final Logger log = LoggerFactory.getLogger(LayerValidationReportService.class);

    private static final Integer PAGE_SIZE = 100;
    private static final String NOT_PASSED = "не обработан ";

    private final String exportStoragePath;
    private final String[] header;

    private CsvHandler csvHandler;
    private ValidationResultRepository validationResultRepository;

    private final DatasourceFactory datasourceFactory;
    private final SchemaService schemaService;
    private final SchemaHandler schemaHandler;
    private final AuthenticationFacade authenticationFacade;
    private final ProcessService processService;

    public LayerValidationReportService(SchemaService schemaService,
                                        SchemaHandler schemaHandler,
                                        Environment environment,
                                        AuthenticationFacade authenticationFacade,
                                        ProcessService processService,
                                        DatasourceFactory datasourceFactory) {
        this.schemaService = schemaService;
        this.schemaHandler = schemaHandler;
        this.authenticationFacade = authenticationFacade;
        this.processService = processService;
        this.datasourceFactory = datasourceFactory;

        exportStoragePath = environment.getRequiredProperty("crg-options.exportStoragePath");
        header = new String[]{" Класс объектов", " Объект класса", " Идентификатор объекта(GLOBALID)", " Имя атрибута",
                " Значение", " Описание ошибки"};
    }

    public Process generateReport(ValidationRequestDto request) {
        final List<ExportResourceModel> resources = request.getResources();
        final String title = String.format("Экспорт отчета об ошибках. Кол-во слоев: %d", resources.size());
        final Map<String, SchemaDto> schemas = fetchSchemas(resources);
        final String dbName = getDefaultDatabaseName(authenticationFacade.getOrganizationId());
        final Process process = processService.create(authenticationFacade.getLogin(),
                                                      title,
                                                      VALIDATION_REPORT,
                                                      request);

        validationResultRepository = new ValidationResultRepository(datasourceFactory, dbName);

        CompletableFuture
                .runAsync(() -> {
                    try {
                        log.info("Init feature: generateReport");

                        ValidationReportModel reportModel = handleResources(resources, schemas);
                        processService.complete(dbName,
                                                process.getId(),
                                                JsonConverter.toJsonNode(reportModel));
                    } catch (Exception e) {
                        log.error("Не удалось создать отчет: {}", e.getMessage());
                        processService.error(dbName, process);
                    } finally {
                        if (nonNull(csvHandler)) {
                            csvHandler.close();
                        }
                    }
                });

        return process;
    }

    private ValidationReportModel handleResources(List<ExportResourceModel> resources,
                                                  Map<String, SchemaDto> schemas) throws IOException {
        final String fileName = initFileName();
        final String filePath = exportStoragePath + fileName;
        ValidationReportModel model = new ValidationReportModel(filePath);
        csvHandler = new CsvHandler(filePath, header);

        resources.forEach(resource -> {
            String schemaName = resource.getSchemaId();
            SchemaDto schemaDto = schemas.get(schemaName);
            if (schemas.containsKey(schemaName)) {
                model.addResourceReports(handleResource(resource, schemaDto));
            } else {
                csvHandler.append(
                        new String[]{"", "", resource.toString(), "", NOT_PASSED, schemaName + " не найдена"});
                model.addResourceReports(new ResourceReport(schemaName, "не найдена", false));
            }
        });

        return model;
    }

    private ResourceReport handleResource(ExportResourceModel resource, SchemaDto schemaDto) {
        try {
            ResourceQualifier rQualifier = new ResourceQualifier(resource.getDataset(),
                                                                 resource.getTable() + EXTENSION_POSTFIX);
            CrgFilter crgFilter = new CrgFilter();
            crgFilter.addFilter("valid", "false", FilterCondition.EQUAL_TO);
            long countPage = (validationResultRepository.getTotal(rQualifier, crgFilter) + PAGE_SIZE - 1) / PAGE_SIZE;

            for (int i = 0; i < countPage; i++) {
                Pageable pageable = PageRequest.of(i, PAGE_SIZE);

                validationResultRepository
                        .findPagedByFilter(rQualifier, pageable, crgFilter).stream()
                        .map(this::extractViolations)
                        .forEach(violations -> writeViolations(violations, schemaDto));
            }

            return new ResourceReport(schemaDto.getTitle(), "обработан", true);
        } catch (Exception e) {
            csvHandler.append(new String[]{"", "", resource.toString(), "", NOT_PASSED, e.getMessage()});

            return new ResourceReport(schemaDto.getTitle(), NOT_PASSED + e.getMessage(), false);
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
        } else if (errorType.startsWith("minLength")) {
            return "Строка слишком короткая";
        } else if (errorType.startsWith("maxLength")) {
            return "Значение превышает допустимый максимум";
        } else if (errorType.startsWith("pattern")) {
            return "Строка не соответствует паттерну";
        } else if (errorType.startsWith("enumeration")) {
            return "Значение не соответствует справочному";
        } else if (errorType.startsWith("notDoubleType")) {
            return "Значение не является дробным числом";
        } else if (errorType.startsWith("notLongType")) {
            return "Значение не является целым числом";
        } else if (errorType.startsWith("maxInclusive")) {
            return "Значение превышает допустимый максимум";
        } else if (errorType.startsWith("totalDigits")) {
            return "Превышено допустимое кол-во знаков";
        } else {
            log.warn("Заданный errorType: {} не найден", errorType);
        }

        return errorType;
    }

    private Map<String, SchemaDto> fetchSchemas(List<ExportResourceModel> resources) {
        Map<String, SchemaDto> schemas = new HashMap<>();
        resources.forEach(res -> {
            schemaService.getSchemaByName(res.getSchemaId())
                         .ifPresent(schemaDto -> schemas.put(res.getSchemaId(), schemaDto));
        });

        return schemas;
    }

    private String initFileName() {
        //TODO формирование рандомного имени, и после скачивания удалять файл
        return "validation.csv";
    }
}
