package ru.mycrg.data_service.service.aop;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.dao.SpatialRecordsDao;
import ru.mycrg.data_service.dao.config.DaoProperties;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.TaskService;
import ru.mycrg.data_service.service.cqrs.library_records.requests.CreateLibraryRecordRequest;
import ru.mycrg.data_service.service.cqrs.library_records.requests.UpdateLibraryRecordRequest;
import ru.mycrg.data_service.service.cqrs.table_records.requests.CreateTableRecordRequest;
import ru.mycrg.data_service.service.cqrs.table_records.requests.UpdateTableRecordRequest;
import ru.mycrg.data_service.service.cqrs.tasks.requests.CreateTaskRequest;
import ru.mycrg.data_service.service.cqrs.tasks.requests.UpdateTaskRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.geo_json.Feature;

import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

import static ru.mycrg.data_service.dto.ResourceType.LIBRARY_RECORD;

@Component
public class FollowUpDataSupplier implements Function<Object, Optional<FollowUpData>> {

    private static final Logger log = LoggerFactory.getLogger(FollowUpDataSupplier.class);

    private final RecordsDao recordsDao;
    private final TaskService taskService;
    private final SpatialRecordsDao spatialRecordsDao;

    public FollowUpDataSupplier(RecordsDao recordsDao,
                                TaskService taskService,
                                SpatialRecordsDao spatialRecordsDao) {
        this.recordsDao = recordsDao;
        this.taskService = taskService;
        this.spatialRecordsDao = spatialRecordsDao;
    }

    @Override
    public Optional<FollowUpData> apply(Object payload) {
        try {
            Feature feature = null;
            if (payload instanceof UpdateTaskRequest) {
                UpdateTaskRequest updateTaskRequest = (UpdateTaskRequest) payload;

                Object idAsObject = updateTaskRequest.getOldRecord().getContent().get(DaoProperties.ID);
                Long id = Long.valueOf(idAsObject.toString());
                Map<String, Object> actualTask = taskService.getById(id);

                feature = new Feature(actualTask);
                feature.setId(id);
            } else if (payload instanceof CreateTaskRequest) {
                CreateTaskRequest createTaskRequest = (CreateTaskRequest) payload;
                Map<String, Object> actualTask = taskService.getById(createTaskRequest.getId());

                feature = new Feature(actualTask);
                feature.setId(createTaskRequest.getId());
            } else if (payload instanceof UpdateTableRecordRequest) {
                UpdateTableRecordRequest updateTableRecordRequest = (UpdateTableRecordRequest) payload;

                SchemaDto schema = updateTableRecordRequest.getSchema();
                ResourceQualifier qualifier = updateTableRecordRequest.getQualifier();

                feature = spatialRecordsDao
                        .findById(qualifier, schema)
                        .orElseThrow(() -> new NotFoundException(qualifier.getRecordIdAsLong()));
            } else if (payload instanceof CreateTableRecordRequest) {
                CreateTableRecordRequest createTableRecordRequest = (CreateTableRecordRequest) payload;

                feature = createTableRecordRequest.getFeature();
            } else if (payload instanceof UpdateLibraryRecordRequest) {
                UpdateLibraryRecordRequest updateLibraryRecordRequest = (UpdateLibraryRecordRequest) payload;

                SchemaDto schema = updateLibraryRecordRequest.getSchema();
                ResourceQualifier qualifier = updateLibraryRecordRequest.getQualifier();

                IRecord record = recordsDao.findById(qualifier, schema)
                                           .orElseThrow(() -> new NotFoundException(qualifier.getRecordIdAsLong()));

                feature = new Feature(record.getContent());
                feature.setId(record.getId());
            } else if (payload instanceof CreateLibraryRecordRequest) {
                CreateLibraryRecordRequest createLibraryRecordRequest = (CreateLibraryRecordRequest) payload;

                SchemaDto schema = createLibraryRecordRequest.getSchema();
                Object idAsObject = createLibraryRecordRequest.getResponseWithReport().getContent()
                                                              .get(DaoProperties.ID);
                Long id = Long.valueOf(idAsObject.toString());

                ResourceQualifier rQualifier = new ResourceQualifier(createLibraryRecordRequest.getQualifier(),
                                                                     id,
                                                                     LIBRARY_RECORD);

                IRecord record = recordsDao.findById(rQualifier, schema)
                                           .orElseThrow(() -> new NotFoundException(rQualifier.getRecordIdAsLong()));

                feature = new Feature(record.getContent());
                feature.setId(record.getId());
            } else {
                log.debug("Unknown request");
            }

            return Optional.of(new FollowUpData(feature));
        } catch (Exception e) {
            log.error("Не удалось достать данные для отправки => {}", e.getMessage(), e);

            return Optional.empty();
        }
    }
}
