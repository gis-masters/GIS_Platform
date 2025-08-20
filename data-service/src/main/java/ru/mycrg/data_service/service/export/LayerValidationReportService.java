package ru.mycrg.data_service.service.export;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.data_service.dao.detached.ValidationResultDao;
import ru.mycrg.data_service.dto.ExportResourceModel;
import ru.mycrg.data_service.dto.ValidationRequestDto;
import ru.mycrg.data_service.dto.WsMessageDto;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service.repository.SchemasAndTablesRepository;
import ru.mycrg.data_service.service.CsvHandler;
import ru.mycrg.data_service.service.WsNotificationService;
import ru.mycrg.data_service.service.processes.ProcessService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.storage.FileStorageService;
import ru.mycrg.data_service.util.JsonConverter;
import ru.mycrg.data_service.util.filter.CrgFilter;
import ru.mycrg.data_service.util.filter.FilterCondition;
import ru.mycrg.data_service_contract.dto.ResourceReport;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.dto.ValidationReportModel;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

import static java.util.Objects.nonNull;
import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;
import static ru.mycrg.data_service.dao.config.DaoProperties.EXTENSION_POSTFIX;
import static ru.mycrg.data_service.mappers.SchemaMapper.jsonToDto;
import static ru.mycrg.data_service.service.schemas.SchemaUtil.getEnumerationTitleByValue;
import static ru.mycrg.data_service.service.schemas.SchemaUtil.getPropertyByName;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.*;
import static ru.mycrg.data_service_contract.enums.ProcessType.VALIDATION_REPORT;

@Service
public class LayerValidationReportService {

    public static final Logger log = LoggerFactory.getLogger(LayerValidationReportService.class);

    private static final Integer PAGE_SIZE = 100;
    private static final String NOT_PASSED = "не обработан ";

    private final String[] headers;

    private CsvHandler csvHandler;
    private ValidationResultDao validationResultDao;

    private final ProcessService processService;
    private final DatasourceFactory datasourceFactory;
    private final FileStorageService fileStorageService;
    private final IAuthenticationFacade authenticationFacade;
    private final WsNotificationService wsNotificationService;
    private final SchemasAndTablesRepository schemasAndTablesRepository;

    public LayerValidationReportService(IAuthenticationFacade authenticationFacade,
                                        ProcessService processService,
                                        DatasourceFactory datasourceFactory,
                                        FileStorageService fileStorageService,
                                        WsNotificationService wsNotificationService,
                                        SchemasAndTablesRepository schemasAndTablesRepository) {
        this.authenticationFacade = authenticationFacade;
        this.processService = processService;
        this.datasourceFactory = datasourceFactory;
        this.fileStorageService = fileStorageService;
        this.wsNotificationService = wsNotificationService;
        this.schemasAndTablesRepository = schemasAndTablesRepository;

        this.headers = new String[]{" Класс объектов", " Объект класса", " Идентификатор объекта(GLOBALID)",
                " Имя атрибута", " Значение", " Описание ошибки"};
    }

    public Process generateReport(ValidationRequestDto request) {
        final List<ExportResourceModel> resources = request.getResources();
        final String title = String.format("Экспорт отчета об ошибках. Кол-во слоев: %d", resources.size());
        final String filePath = fileStorageService.getExportStoragePath() + "/" +  initFileName();
        final String dbName = getDefaultDatabaseName(authenticationFacade.getOrganizationId());
        final Map<String, SchemaDto> schemas = fetchSchemas(resources);
        final Process process = processService.create(authenticationFacade.getLogin(),
                                                      title,
                                                      VALIDATION_REPORT,
                                                      request);

        validationResultDao = new ValidationResultDao(datasourceFactory, dbName);

        CompletableFuture
                .runAsync(() -> {
                    String wsUiId = processService.getWsUiId(process);
                    ValidationReportModel reportModel = new ValidationReportModel(filePath, title);
                    try {
                        log.info("Init feature: generateReport");

                        reportModel.setStatus(PENDING);
                        wsNotificationService.send(new WsMessageDto<>(VALIDATION_REPORT.name(), reportModel), wsUiId);

                        handleResources(resources, schemas, filePath, reportModel);

                        reportModel.setStatus(DONE);
                        processService.complete(dbName,
                                                process.getId(),
                                                JsonConverter.toJsonNode(reportModel));

                        wsNotificationService.send(new WsMessageDto<>(VALIDATION_REPORT.name(), reportModel), wsUiId);
                    } catch (Exception e) {
                        log.error("Не удалось создать отчет: {}", e.getMessage());
                        processService.error(dbName, process);

                        reportModel.setStatus(ERROR);
                        reportModel.setError(e.getMessage());
                        wsNotificationService.send(new WsMessageDto<>(VALIDATION_REPORT.name(), reportModel), wsUiId);
                    } finally {
                        if (nonNull(csvHandler)) {
                            csvHandler.close();
                        }
                    }
                });

        return process;
    }

    private void handleResources(List<ExportResourceModel> resources,
                                 Map<String, SchemaDto> schemas,
                                 String filePath,
                                 ValidationReportModel model) throws IOException {
        csvHandler = new CsvHandler(filePath, headers);

        resources.forEach(resource -> {
            String tableIdentifier = resource.getTable();
            SchemaDto schemaDto = schemas.get(tableIdentifier);
            if (schemas.containsKey(tableIdentifier)) {
                ResourceReport resourceReport = handleResource(resource, schemaDto);

                model.addResourceReports(resourceReport);
            } else {
                String msg = "Не найдена схема слоя: " + tableIdentifier;
                csvHandler.append(new String[]{"", "", resource.toString(), "", NOT_PASSED, msg});
                model.addResourceReports(new ResourceReport(tableIdentifier, msg, false));
            }
        });
    }

    private ResourceReport handleResource(ExportResourceModel resource, SchemaDto schemaDto) {
        try {
            ResourceQualifier rQualifier = new ResourceQualifier(resource.getDataset(),
                                                                 resource.getTable() + EXTENSION_POSTFIX);
            CrgFilter crgFilter = new CrgFilter();
            crgFilter.addFilter("valid", "false", FilterCondition.EQUAL_TO);
            long countPage = (validationResultDao.getTotal(rQualifier, crgFilter) + PAGE_SIZE - 1) / PAGE_SIZE;

            for (int i = 0; i < countPage; i++) {
                Pageable pageable = PageRequest.of(i, PAGE_SIZE);

                validationResultDao
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
        Optional<SimplePropertyDto> oProperty = getPropertyByName(schemaDto, propertyName);
        if (oProperty.isEmpty()) {
            objectClass = propertyName;
        } else {
            String classIdValue = violationNode.get("classId").asText();
            objectClass = getEnumerationTitleByValue(oProperty.get(), classIdValue);
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

    private JsonNode extractViolations(IRecord record) {
        return JsonConverter.toJsonNodeFromString((String) record.getContent().get("violations"));
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

        List<String> tableIdentifiers = resources.stream()
                                                 .map(ExportResourceModel::getTable)
                                                 .collect(Collectors.toList());
        schemasAndTablesRepository.findByIdentifierIn(tableIdentifiers)
                                  .forEach(table -> {
                                      SchemaDto schema = jsonToDto(table.getSchema());

                                      schemas.put(table.getIdentifier(), schema);
                                  });

        return schemas;
    }

    private String initFileName() {
        //TODO после скачивания удалять файл
        return UUID.randomUUID().toString().substring(0, 8) + ".csv";
    }
}
