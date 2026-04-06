package ru.mycrg.data_service.queue.handlers.gpkg;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.GeometryDaoDetached;
import ru.mycrg.data_service.dao.config.DatasourceFactory;
import ru.mycrg.data_service.dao.core.CoreTemplateDao;
import ru.mycrg.data_service.entity.SchemasAndTables;
import ru.mycrg.data_service.repository.SchemasAndTablesRepositoryDetached;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.util.SimplePropertyCollector;
import ru.mycrg.data_service_contract.dto.ErrorReport;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.enums.ValueType;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgCopyDataBackwardEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgCopyDataEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.IMessageBusProducer;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import jakarta.validation.constraints.NotNull;
import java.util.*;
import java.util.stream.Collectors;

import static java.time.LocalDateTime.now;
import static ru.mycrg.data_service.dao.utils.SqlBuilder.buildCopyGpkgFileQuery;
import static ru.mycrg.data_service.util.SystemLibraryAttributes.*;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_DONE;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_ERROR;
import static ru.mycrg.http_client.JsonConverter.fromJson;

@Service
public class ImportGpkgCopyDataEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(ImportGpkgCopyDataEventHandler.class);

    private final SchemasAndTablesRepositoryDetached schemasAndTablesRepository;
    private final SimplePropertyCollector simplePropertyCollector;
    private final DatasourceFactory datasourceFactory;
    private final GeometryDaoDetached geometryDao;
    private final CoreTemplateDao coreTemplateDao;
    private final IMessageBusProducer messageBus;

    public ImportGpkgCopyDataEventHandler(SchemasAndTablesRepositoryDetached schemasAndTablesRepository,
                                          SimplePropertyCollector simplePropertyCollector,
                                          DatasourceFactory datasourceFactory,
                                          GeometryDaoDetached geometryDao,
                                          CoreTemplateDao coreTemplateDao,
                                          IMessageBusProducer messageBus) {
        this.schemasAndTablesRepository = schemasAndTablesRepository;
        this.simplePropertyCollector = simplePropertyCollector;
        this.datasourceFactory = datasourceFactory;
        this.geometryDao = geometryDao;
        this.coreTemplateDao = coreTemplateDao;
        this.messageBus = messageBus;
    }

    @Override
    public String getEventType() {
        return ImportGpkgCopyDataEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        log.debug("Начали обработку запроса копирования данных из GPKG.");

        final ImportGpkgCopyDataEvent event = (ImportGpkgCopyDataEvent) mqEvent;
        final String businessKey = event.getBusinessKey();
        JdbcTemplate jdbcTemplate = new JdbcTemplate(datasourceFactory.getDataSource(event.getDbName()));

        // 1. Проверяем всю новую геометрию на валидность перед импортом
        ResourceQualifier sourceResource = new ResourceQualifier(event.getSource().getSchema(),
                                                                 event.getSource().getTable());

        ErrorReport errorReport = new ErrorReport();

        try {
            makeGpkgGeometryValid(jdbcTemplate, sourceResource, errorReport);
        } catch (Exception e) {
            String msg = String.format("Невозможно исправить геометрию таблицы %s. Причина: %s",
                                       sourceResource.getTable(), e.getMessage());
            log.error(msg);
            List<String> messages = errorReport.getMessages();
            messages.add(msg);
            messageBus.produce(new ImportGpkgCopyDataBackwardEvent(TASK_ERROR, businessKey, errorReport));

            return;
        }

        // 2. Копируем данные из временной таблицы в целевую
        ResourceQualifier targetResource = new ResourceQualifier(event.getTarget().getSchema(),
                                                                 event.getTarget().getTable());

        Optional<SchemaDto> actualSchemaDto = schemasAndTablesRepository
                .findByIdentifier(jdbcTemplate, targetResource.getTable())
                .map(SchemasAndTables::getSchema)
                .flatMap(jsonNode -> fromJson(jsonNode.toString(), SchemaDto.class));

        if (actualSchemaDto.isEmpty()) {
            String msg = "Таблица была создана без схемы. Импорт невозможен!";
            log.error(msg);
            List<String> messages = errorReport.getMessages();
            messages.add(msg);
            messageBus.produce(new ImportGpkgCopyDataBackwardEvent(TASK_ERROR, businessKey, errorReport));

            return;
        }

        copy(sourceResource,
             targetResource,
             event.getCreator(),
             actualSchemaDto.get(),
             jdbcTemplate,
             errorReport);

        messageBus.produce(new ImportGpkgCopyDataBackwardEvent(TASK_DONE, businessKey, errorReport));
    }

    private void makeGpkgGeometryValid(JdbcTemplate jdbcTemplate,
                                       ResourceQualifier sourceResource,
                                       ErrorReport errorReport) {
        List<String> messages = new ArrayList<>();

        try {
            log.debug("Проверяем всю новую геометрию на валидность перед импортом.");

            int countOfInvalidGeometry = geometryDao.getInvalidGeometryRowsCount(jdbcTemplate,
                                                                                 sourceResource.getSchema(),
                                                                                 sourceResource.getTable());
            if (countOfInvalidGeometry > 0) {
                messages.add("Объектов с невалидной геометрией: " + countOfInvalidGeometry);

                geometryDao.makeValid(jdbcTemplate,
                                      sourceResource.getSchema(),
                                      sourceResource.getTable());

                countOfInvalidGeometry = geometryDao.getInvalidGeometryRowsCount(jdbcTemplate,
                                                                                 sourceResource.getSchema(),
                                                                                 sourceResource.getTable());

                if (countOfInvalidGeometry > 0) {

                    messages.add(String.format(
                            "После приведения геометрии к валидному виду, осталось %d невалидных записей.",
                            countOfInvalidGeometry));

                    geometryDao.deleteAllRowsWithInvalidGeometry(jdbcTemplate,
                                                                 sourceResource);

                    messages.add(String.format("Перед копированием было удалено %d невалидных записей.",
                                               countOfInvalidGeometry));
                }
            }
            errorReport.setMessages(messages);
        } catch (Exception e) {
            String msg = "Серьёзная ошибка при проверки валидности геометрии: " + e.getMessage();
            log.error(msg, e);
            messages.add(msg);
            errorReport.setMessages(messages);
        }
    }

    private void copy(ResourceQualifier sourceResource,
                      ResourceQualifier targetResource,
                      String creator,
                      SchemaDto actualSchemaDto,
                      JdbcTemplate jdbcTemplate,
                      ErrorReport errorReport) {
        try {
            // В отличие от shp мы можем всегда собирать SimplePropertyDto из SchemaDto
            // Потому что временная таблица когда была создана по той же SchemaDto что и новая
            Set<String> columnsForExclude = getSystemColumnsForExclude(targetResource);
            List<SimplePropertyDto> sourcePropsWithoutSystemFields = actualSchemaDto
                    .getProperties()
                    .stream()
                    .filter(property -> !columnsForExclude.contains(property.getName()))
                    .collect(Collectors.toList());

            log.debug("До удаления из сорса {}", sourcePropsWithoutSystemFields.size());
            //Однако иногда у нас схемы нет и мы собираем её "налету"
            //Доп. Мы же можем в QGIS модифицировать таблицу при этом не трогая схему так что проверка полезна
            findAndRemoveAllDefunctProps(jdbcTemplate, sourcePropsWithoutSystemFields, sourceResource);
            log.debug("После из сорса {}", sourcePropsWithoutSystemFields.size());

            Map<String, Object> systemAutogeneratedField = new HashMap<>();
            systemAutogeneratedField.put(CREATED_AT.getName(), now());
            systemAutogeneratedField.put(CREATED_BY.getName(), creator);

            String copyQuery = buildCopyGpkgFileQuery(sourceResource,
                                                      targetResource,
                                                      sourcePropsWithoutSystemFields,
                                                      actualSchemaDto.getProperties(),
                                                      systemAutogeneratedField);

            log.debug("Запрос [{}]", copyQuery);

            Long insertedQuantity = coreTemplateDao.queryForObject(jdbcTemplate, copyQuery, Long.class);
            String msg = String.format("Процесс переноса данных из временной таблицы успешно завершён. Перенесено " +
                                               "объектов: %d.", insertedQuantity);
            log.debug(msg);

            errorReport.getMessages().add(msg);
            errorReport.setSuccessfulRecordCount(insertedQuantity);
        } catch (Exception e) {
            String msg = "Ошибка при копировании объектов: " + e.getMessage() + " В проект будет добавлен пустой слой.";
            log.warn(msg, e);
            List<String> messages = errorReport.getMessages();
            messages.add(msg);
            errorReport.setMessages(messages);
        }
    }

    private static @NotNull Set<String> getSystemColumnsForExclude(ResourceQualifier targetTable) {
        return Set.of(targetTable.getPrimaryKeyName(),
                      CREATED_AT.getName(),
                      UPDATED_BY.getName(),
                      CREATED_BY.getName(),
                      LAST_MODIFIED.getName());
    }

    /**
     * Удаляет из sourcePropsWithoutSystemFields свойства, которых нет в sourceResource или у них не совпадает тип.
     */
    private void findAndRemoveAllDefunctProps(JdbcTemplate jdbcTemplate,
                                              List<SimplePropertyDto> sourcePropsWithoutSystemFields,
                                              ResourceQualifier sourceResource) {
        List<SimplePropertyDto> realDbProps = simplePropertyCollector
                .getSimpleProperties(jdbcTemplate, sourceResource);

        Map<String, ValueType> generatedPropsMap = realDbProps.stream()
                                                              .collect(Collectors.toMap(
                                                                      SimplePropertyDto::getName,
                                                                      SimplePropertyDto::getValueTypeAsEnum));

        //Возможно тут нужна проверка ещё и по ValueType тем более что Map мы таскаем цельную.
        //Но тогда мы начинаем терять наши поля типа choice если делаем тупой equals, а умный equals пока лень.
        //Вполне вероятно что текущего кода на долго хватит
        sourcePropsWithoutSystemFields.removeIf(currProp -> !generatedPropsMap.containsKey(currProp.getName()));
    }
}
