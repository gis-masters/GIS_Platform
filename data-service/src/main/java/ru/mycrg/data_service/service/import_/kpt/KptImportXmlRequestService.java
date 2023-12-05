package ru.mycrg.data_service.service.import_.kpt;

import org.apache.commons.lang3.tuple.Pair;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.auth_facade.UserDetails;
import ru.mycrg.data_service.dto.kpt_import.KptImportXmlRequest;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.entity.RecordEntity;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.SchemaService;
import ru.mycrg.data_service.service.cqrs.tasks.requests.CreateTaskRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.util.SystemLibraryAttributes;
import ru.mycrg.data_service_contract.dto.ImportSourceFileDto;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.TypeDocumentData;
import ru.mycrg.data_service_contract.dto.import_.KptImportValidationSettings;
import ru.mycrg.data_service_contract.enums.TaskType;
import ru.mycrg.data_service_contract.queue.request.KptImportXmlRequestEvent;
import ru.mycrg.mediator.Mediator;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.TASK;
import static ru.mycrg.data_service.service.TaskService.TASKS_SCHEMA;
import static ru.mycrg.data_service.service.TaskService.TASK_TABLE_NAME;
import static ru.mycrg.data_service.util.JsonConverter.toJsonNode;

/**
 * Сервис обработки задач на импорт КПТ из XML
 */
@Service
public class KptImportXmlRequestService {

    private static final int DEFAULT_ALLOWED_RECORDS_DIFF = 10;
    private static final String TASK_TYPE_PROPERTY = "type";
    private static final String TASK_ASSIGNED_TO_PROPERTY = "assigned_to";
    private static final String TASK_OWNER_ID_PROPERTY = "owner_id";
    private static final String TASK_DATA_SECTION_PROPERTY = "data_section_key_data_connection";
    private static final String TASK_CONTENT_TYPE = "common_task_kpt_import";

    private final IMessageBusProducer messageBus;
    private final SchemaService schemaService;
    private final IAuthenticationFacade authenticationFacade;
    private final KptSourceFilesService kptSourceFilesService;
    private final Mediator mediator;

    public KptImportXmlRequestService(IMessageBusProducer messageBus,
                                      SchemaService schemaService,
                                      IAuthenticationFacade authenticationFacade,
                                      KptSourceFilesService kptSourceFilesService,
                                      Mediator mediator) {
        this.messageBus = messageBus;
        this.schemaService = schemaService;
        this.authenticationFacade = authenticationFacade;
        this.kptSourceFilesService = kptSourceFilesService;
        this.mediator = mediator;
    }

    /**
     * Создает задачу импорта и отправляет в очередь событие на запуск импорта
     *
     * @param request запрос на импорт
     *
     * @return task импорта
     */
    public IRecord initImport(KptImportXmlRequest request) {
        IRecord kptRecord = kptSourceFilesService.getKptRecord(request.getFileId());
        if (kptRecord == null) {
            throw new DataServiceException("Не найден КПТ id=" + request.getFileId());
        }
        IRecord task = createTask(kptRecord);
        Pair<List<ImportSourceFileDto>, String> sourceFilesPair =
                kptSourceFilesService.getSourceFiles(kptRecord);
        handleValidationSettings(request.getValidationSettings(), sourceFilesPair.getRight());
        KptImportXmlRequestEvent event = new KptImportXmlRequestEvent(
                sourceFilesPair.getLeft(),
                getDatabaseName(),
                findSchemas(request.getLayersSchemasNames()),
                authenticationFacade.getLogin(),
                request.getProjectId(),
                task.getId(),
                request.getValidationSettings()
        );
        messageBus.produce(event);
        return task;
    }

    private String getDatabaseName() {
        Long orgId = authenticationFacade.getOrganizationId();
        return getDefaultDatabaseName(orgId);
    }

    private List<SchemaDto> findSchemas(List<String> names) {
        List<SchemaDto> schemas = schemaService.getSchemas(names);
        if (schemas.size() != names.size()) {
            List<String> foundNames = schemas.stream().map(SchemaDto::getName).collect(Collectors.toList());
            String notFoundNames = names.stream()
                                        .filter(name -> !foundNames.contains(name))
                                        .collect(Collectors.joining(","));
            throw new DataServiceException("Не найдены схемы для импорта: " + notFoundNames);
        }
        return schemas;
    }

    private IRecord createTask(IRecord kptRecord) {
        Map<String, Object> body = prepareTaskBody(kptRecord);
        SchemaDto tasksSchema = this.schemaService
                .getSchemaByName(TASKS_SCHEMA)
                .orElseThrow(() -> new NotFoundException("Не найдена схема задач: " + TASKS_SCHEMA));
        return mediator.execute(
                new CreateTaskRequest(tasksSchema,
                                      new ResourceQualifier(SYSTEM_SCHEMA_NAME, TASK_TABLE_NAME, TASK),
                                      new RecordEntity(body)));
    }

    private Map<String, Object> prepareTaskBody(IRecord kptRecord) {
        UserDetails userDetails = authenticationFacade.getUserDetails();
        TypeDocumentData typeDocumentData = new TypeDocumentData(
                kptRecord.getId(), kptRecord.getTitle(), KptSourceFilesService.KPT_LIBRARY_ID);
        Map<String, Object> body = new HashMap<>();
        body.put(TASK_TYPE_PROPERTY, TaskType.CUSTOM.name());
        body.put(TASK_ASSIGNED_TO_PROPERTY, userDetails.getUserId());
        body.put(TASK_OWNER_ID_PROPERTY, userDetails.getUserId());
        body.put(SystemLibraryAttributes.CONTENT_TYPE_ID.getName(), TASK_CONTENT_TYPE);
        body.put(SystemLibraryAttributes.CREATED_AT.getName(), LocalDate.now());
        body.put(TASK_DATA_SECTION_PROPERTY, toJsonNode(typeDocumentData).toString());
        return body;
    }

    private void handleValidationSettings(@Nullable KptImportValidationSettings settings, String dateOrderCompletion) {
        if (settings != null) {
            if (settings.isValidateRecordsCount() && settings.getAllowedDiff() == null) {
                settings.setAllowedDiff(DEFAULT_ALLOWED_RECORDS_DIFF);
            }
            if (settings.isValidateFreshness()) {
                settings.setDateOrderCompletion(dateOrderCompletion);
            }
        }
    }
}
