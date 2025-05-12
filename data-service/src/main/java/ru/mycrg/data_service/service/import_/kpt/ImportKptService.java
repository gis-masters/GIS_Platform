package ru.mycrg.data_service.service.import_.kpt;

import com.fasterxml.jackson.databind.JsonNode;
import org.apache.commons.lang3.tuple.Pair;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.auth_facade.UserDetails;
import ru.mycrg.data_service.dto.kpt_import.ImportKptRequest;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.dto.record.RecordEntity;
import ru.mycrg.data_service.entity.SchemasAndTables;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.queue.handlers.ImportKptHandler;
import ru.mycrg.data_service.repository.SchemasAndTablesRepository;
import ru.mycrg.data_service.service.cqrs.tasks.requests.CreateTaskRequest;
import ru.mycrg.data_service.service.cqrs.tasks.requests.UpdateTaskStatusRequest;
import ru.mycrg.data_service.service.schemas.ISchemaTemplateService;
import ru.mycrg.data_service_contract.dto.DatasetResourceQualifierDto;
import ru.mycrg.data_service_contract.dto.ImportSourceFileDto;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.TypeDocumentData;
import ru.mycrg.data_service_contract.dto.import_.ImportKptTableDto;
import ru.mycrg.data_service_contract.dto.import_.KptImportValidationSettings;
import ru.mycrg.data_service_contract.enums.TaskType;
import ru.mycrg.data_service_contract.queue.request.ImportKptEvent;
import ru.mycrg.mediator.Mediator;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultDatabaseName;
import static ru.mycrg.data_service.mappers.SchemaMapper.jsonToDto;
import static ru.mycrg.data_service.service.TaskService.*;
import static ru.mycrg.data_service.service.import_.kpt.KptSourceFilesService.KPT_LIBRARY_ID;
import static ru.mycrg.data_service.service.smev3.request.get_cadastrial_plan.GetCadastrialPlanRequestService.DATA_SECTION_KEY_DATA_CONNECTION_ATTRIBUTE;
import static ru.mycrg.data_service.util.JsonConverter.toJsonNode;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.CONTENT_TYPE_ID;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.CREATED_AT;
import static ru.mycrg.data_service_contract.enums.TaskStatus.CANCELED;

/**
 * Сервис обработки задач на импорт КПТ из XML
 */
@Service
public class ImportKptService {

    public static final String KPT_IMPORT_CONTENT_TYPE = "common_task_kpt_import";

    private static final int DEFAULT_ALLOWED_RECORDS_DIFF = 10;

    private final Mediator mediator;
    private final ISchemaTemplateService schemaService;
    private final IMessageBusProducer messageBus;
    private final IAuthenticationFacade authenticationFacade;
    private final KptSourceFilesService kptSourceFilesService;
    private final SchemasAndTablesRepository schemasAndTablesRepository;
    private final ImportKptHandler importKptHandler;

    public ImportKptService(IMessageBusProducer messageBus,
                            @Qualifier("schemaTemplateServiceBase") ISchemaTemplateService schemaService,
                            IAuthenticationFacade authenticationFacade,
                            KptSourceFilesService kptSourceFilesService,
                            Mediator mediator,
                            SchemasAndTablesRepository schemasAndTablesRepository,
                            ImportKptHandler importKptHandler) {
        this.messageBus = messageBus;
        this.schemaService = schemaService;
        this.authenticationFacade = authenticationFacade;
        this.kptSourceFilesService = kptSourceFilesService;
        this.mediator = mediator;
        this.schemasAndTablesRepository = schemasAndTablesRepository;
        this.importKptHandler = importKptHandler;
    }

    /**
     * Создает задачу импорта и отправляет в очередь событие на запуск импорта
     *
     * @param importRequest запрос на импорт
     *
     * @return task импорта
     */
    public IRecord initImport(ImportKptRequest importRequest) {
        IRecord kpt = kptSourceFilesService.getKptById(importRequest.getDocumentId());
        IRecord task = createTask(kpt);

        Pair<List<ImportSourceFileDto>, String> sourceFilesPair = kptSourceFilesService.getSourceFiles(kpt);
        handleValidationSettings(importRequest.getValidationSettings(), sourceFilesPair.getRight());

        messageBus.produce(
                new ImportKptEvent(sourceFilesPair.getLeft(),
                                   getDefaultDatabaseName(authenticationFacade.getOrganizationId()),
                                   buildTableImportDtoList(importRequest.getTables()),
                                   authenticationFacade.getLogin(),
                                   task.getId(),
                                   authenticationFacade.getUserDetails().getUserId(),
                                   importRequest.getValidationSettings()));

        return task;
    }

    public void cancelImport(@NotNull Long taskId) {
        importKptHandler.cancelImport();

        mediator.execute(new UpdateTaskStatusRequest(CANCELED, taskId));
    }

    private List<ImportKptTableDto> buildTableImportDtoList(List<DatasetResourceQualifierDto> qualifiers) {
        List<String> tableIdentifiers = qualifiers.stream()
                                                  .map(DatasetResourceQualifierDto::getTable)
                                                  .collect(Collectors.toList());

        List<SchemasAndTables> foundTables = schemasAndTablesRepository.findByIdentifierIn(tableIdentifiers);
        checkTablesExists(foundTables, tableIdentifiers);

        List<ImportKptTableDto> result = new LinkedList<>();
        for (SchemasAndTables table: foundTables) {
            JsonNode schema = table.getSchema();
            String tableIdentifier = table.getIdentifier();
            String tableCrs = table.getCrs();
            if (schema == null) {
                throw new DataServiceException("Не найдена схема таблицы " + tableIdentifier);
            }

            DatasetResourceQualifierDto qualifierDto = qualifiers
                    .stream()
                    .filter(it -> it.getTable().equals(tableIdentifier))
                    .findFirst()
                    .orElseThrow(() -> new DataServiceException("Не найдена таблица: " + tableIdentifier));

            result.add(
                    new ImportKptTableDto(qualifierDto.getDataset(),
                                          qualifierDto.getTable(),
                                          jsonToDto(schema),
                                          tableCrs));
        }

        return result;
    }

    private void checkTablesExists(List<SchemasAndTables> foundTables, List<String> requestedTables) {
        if (foundTables.size() < requestedTables.size()) {
            List<String> foundIdentifiers = foundTables.stream()
                                                       .map(SchemasAndTables::getIdentifier)
                                                       .collect(Collectors.toList());
            String notFoundNames = requestedTables.stream()
                                                  .filter(identifier -> !foundIdentifiers.contains(identifier))
                                                  .collect(Collectors.joining(","));
            throw new BadRequestException("Не найдены таблицы для импорта: " + notFoundNames);
        }
    }

    private IRecord createTask(IRecord kptRecord) {
        Map<String, Object> body = prepareTaskBody(kptRecord);
        SchemaDto tasksSchema = this.schemaService
                .getSchemaByName(TASKS_SCHEMA)
                .orElseThrow(() -> new NotFoundException("Не найдена схема задач: " + TASKS_SCHEMA));

        return mediator.execute(
                new CreateTaskRequest(tasksSchema, TASK_QUALIFIER, new RecordEntity(body)));
    }

    private Map<String, Object> prepareTaskBody(IRecord kptRecord) {
        UserDetails userDetails = authenticationFacade.getUserDetails();
        TypeDocumentData typeDocumentData = new TypeDocumentData(kptRecord.getId(),
                                                                 kptRecord.getTitle(),
                                                                 KPT_LIBRARY_ID);

        Map<String, Object> body = new HashMap<>();
        body.put(TASK_TYPE_PROPERTY, TaskType.CUSTOM.name());
        body.put(TASK_ASSIGNED_TO_PROPERTY, userDetails.getUserId());
        body.put(TASK_OWNER_ID_PROPERTY, userDetails.getUserId());
        body.put(CONTENT_TYPE_ID.getName(), KPT_IMPORT_CONTENT_TYPE);
        body.put(CREATED_AT.getName(), LocalDate.now());
        body.put(DATA_SECTION_KEY_DATA_CONNECTION_ATTRIBUTE, toJsonNode(typeDocumentData).toString());

        return body;
    }

    private void handleValidationSettings(@Nullable KptImportValidationSettings settings, String dateOrderCompletion) {
        if (settings == null) {
            return;
        }

        if (settings.isValidateRecordsCount() && settings.getAllowedDiff() == null) {
            settings.setAllowedDiff(DEFAULT_ALLOWED_RECORDS_DIFF);
        }

        if (settings.isValidateFreshness()) {
            settings.setDateOrderCompletion(dateOrderCompletion);
        }
    }
}
