package ru.mycrg.data_service.service.gisogd;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dao.BaseReadDao;
import ru.mycrg.data_service.dao.GisogdRfDao;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.dto.record.RecordEntity;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.cqrs.tasks.requests.CreateTaskRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.schemas.ISchemaTemplateService;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.mediator.Mediator;

import java.util.*;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.service.TaskService.TASKS_SCHEMA;
import static ru.mycrg.data_service.service.TaskService.TASK_QUALIFIER;
import static ru.mycrg.data_service_contract.enums.TaskType.SYSTEM;

@Service
public class GisogdRfService {

    private final Logger log = LoggerFactory.getLogger(GisogdRfService.class);

    private final BaseReadDao baseReadDao;
    private final GisogdRfDao gisogdRfDao;

    private final Mediator mediator;
    private final IAuthenticationFacade authenticationFacade;

    private final GisogdRfUtil gisogdRfUtil;
    private final ISchemaTemplateService schemaService;

    private final GisogdRfPublisherFactory gisogdRfPublisherFactory;
    private final RecordPublisher recordPublisher;
    private final RecordsCache recordsCache;

    public GisogdRfService(BaseReadDao baseReadDao,
                           GisogdRfDao gisogdRfDao,
                           Mediator mediator,
                           GisogdRfUtil gisogdRfUtil,
                           @Qualifier("schemaTemplateServiceBase") ISchemaTemplateService schemaService,
                           IAuthenticationFacade authenticationFacade,
                           GisogdRfPublisherFactory gisogdRfPublisherFactory,
                           RecordPublisher recordPublisher,
                           RecordsCache recordsCache) {
        this.baseReadDao = baseReadDao;
        this.gisogdRfDao = gisogdRfDao;
        this.mediator = mediator;
        this.gisogdRfUtil = gisogdRfUtil;
        this.schemaService = schemaService;
        this.authenticationFacade = authenticationFacade;
        this.gisogdRfPublisherFactory = gisogdRfPublisherFactory;
        this.recordPublisher = recordPublisher;
        this.recordsCache = recordsCache;
    }

    public Long publish(ResourceQualifier qualifier, int srid) {
        recordsCache.clear();
        log.debug("Публикация одной записи: {}", qualifier);
        cacheSchemasAndTables();

        IRecord parentDoc = baseReadDao
                .findById(qualifier)
                .orElseThrow(() -> new DataServiceException("Не найден документ: " + qualifier.getQualifier()));

        long taskId = -314L;

        recordPublisher.publishDocument(taskId, qualifier, srid, parentDoc);

        return taskId;
    }

    /**
     * Публикация всего.
     * <p><br>
     * Список таблиц, из которых отправляются данные должен формироваться по критерию: в схеме данных есть поле
     * gisogdrf_publication_datetime
     * <p><br>
     * <p> Существуют критерии какие записи должны быть отправлены:
     * <ul>
     *   <li>не отправляются папки</li>
     *   <li>направляются документы, у которых не указана gisogdrf_publication_datetime - это новые, еще ни разу не
     *       синхронизированные документы.</li>
     *   <li>направляются документы, у которых last_modified после даты gisogdrf_publication_datetime - это обновленные
     *       документы</li>
     * </ul>
     *
     * @return Идентификатор начатой системной задачи.
     */
    public Long fullPublication(Long limit, int srid) {
        IRecord record = createSystemTask();
        Long taskId = record.getId();

        recordsCache.clear();
        log.debug("Старт публикации в ГИСОГД РФ с лимитом: [{}] Создана задача: [{}]", limit, taskId);
        cacheSchemasAndTables();

        List<GisogdData> sortedGisogdEntities = gisogdRfUtil
                .getSchemasPreparedForGisogdRf()
                .stream()
                .flatMap(schemaId -> gisogdRfUtil.collectGisogdRfEntities(schemaId).stream())
                .filter(gisogdData -> gisogdData.getPublishOrder() >= 0)
                .sorted(Comparator.comparing(GisogdData::getPublishOrder))
                .collect(Collectors.toList());

        log.debug("Установлен следующий порядок отправки: {}", sortedGisogdEntities);

        Map<String, Long> resultLog = doPublishForAllEntities(limit, srid, sortedGisogdEntities, taskId);

        log.debug("Все события были разосланы. Задача: [{}] \n Result time Log: {}", taskId, resultLog);
        recordsCache.printStatistics();

        return taskId;
    }

    /**
     * Публикация всех объектов из конкретной библиотеки.
     *
     * @param libraryName Имя библиотеки
     * @param limit       Максимальное количество объектов для публикации
     * @param srid        Система координат
     *
     * @return Идентификатор начатой системной задачи
     */
    public Long libraryPublication(String libraryName, Long limit, int srid) {
        IRecord record = createSystemTask();
        Long taskId = record.getId();

        recordsCache.clear();
        log.debug("Старт публикации библиотеки [{}] в ГИСОГД РФ с лимитом: [{}] Создана задача: [{}]",
                  libraryName,
                  limit,
                  taskId);

        cacheSchemasAndTables();

        List<GisogdData> sortedGisogdEntities = gisogdRfUtil
                .getSchemasPreparedForGisogdRf()
                .stream()
                .flatMap(schemaId -> gisogdRfUtil.collectGisogdRfEntities(schemaId).stream())
                .filter(gisogdData -> gisogdData.getPublishOrder() >= 0)
                .filter(gisogdData -> libraryName.equals(gisogdData.getResourceQualifier().getTable()))
                .collect(Collectors.toList());

        log.debug("Найдено [{}] объектов для публикации из библиотеки [{}]", sortedGisogdEntities.size(), libraryName);

        Map<String, Long> resultLog = doPublishForAllEntities(limit, srid, sortedGisogdEntities, taskId);

        log.debug("Все объекты из библиотеки [{}] были разосланы. Задача: [{}] \n Result time Log: {}", libraryName,
                  taskId, resultLog);
        recordsCache.printStatistics();

        return taskId;
    }

    private Map<String, Long> publish(Long taskId, ResourceQualifier qualifier, int srid, Long limit) {
        Optional<IGisogdRfPublisher> oPublisher = gisogdRfPublisherFactory.getPublisher(qualifier);
        if (oPublisher.isPresent()) {
            return oPublisher.get()
                             .publish(taskId, qualifier, srid, limit);
        } else {
            log.error("Публикация не поддерживается для: {}", qualifier.getType());

            return Map.of();
        }
    }

    private IRecord createSystemTask() {
        SchemaDto tasksSchema = this.schemaService
                .getSchemaByName(TASKS_SCHEMA)
                .orElseThrow(() -> new NotFoundException("Не найдена схема задач: " + TASKS_SCHEMA));

        Map<String, Object> content = new HashMap<>();
        content.put("owner_id", authenticationFacade.getUserDetails().getUserId());
        content.put("type", SYSTEM.name());

        return mediator.execute(
                new CreateTaskRequest(tasksSchema, TASK_QUALIFIER, new RecordEntity(content)));
    }

    private void cacheSchemasAndTables() {
        List<IRecord> all = gisogdRfDao.findAllPairsTablesAndTheirDatasets();
        all.forEach(record -> {
            recordsCache.addRecord("tableDatasetPairs",
                                   record.getAsString("table"),
                                   record);
        });
    }

    private @NotNull Map<String, Long> doPublishForAllEntities(Long limit,
                                                              int srid,
                                                              List<GisogdData> sortedGisogdEntities,
                                                              Long taskId) {
        Map<String, Long> resultLog = new HashMap<>();
        sortedGisogdEntities.forEach(gisogdData -> {
            Map<String, Long> currentLog = publish(taskId, gisogdData.getResourceQualifier(), srid, limit);

            currentLog.forEach((k, v) -> {
                Long resultTime = resultLog.getOrDefault(k, 0L);

                resultLog.put(k, resultTime + v);
            });
        });

        return resultLog;
    }
}
