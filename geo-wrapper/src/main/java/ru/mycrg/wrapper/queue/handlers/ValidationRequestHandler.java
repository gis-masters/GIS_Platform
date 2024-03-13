package ru.mycrg.wrapper.queue.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.dto.ObjectValidationResult;
import ru.mycrg.data_service_contract.dto.ResourceProjection;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.ValidationProcessModel;
import ru.mycrg.data_service_contract.queue.request.ValidationRequestEvent;
import ru.mycrg.data_service_contract.queue.response.ValidationResponseEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.IMessageBusProducer;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;
import ru.mycrg.wrapper.dao.BaseDaoService;
import ru.mycrg.wrapper.dao.DaoProperties;
import ru.mycrg.wrapper.dao.DatasourceFactory;
import ru.mycrg.wrapper.service.validation.IValidator;
import ru.mycrg.wrapper.service.validation.Util;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static java.time.temporal.ChronoUnit.SECONDS;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.*;
import static ru.mycrg.wrapper.dao.DaoProperties.*;
import static ru.mycrg.wrapper.service.export.GmlUtil.calculatePercent;

@Service
public class ValidationRequestHandler implements IEventHandler {

    private static final Logger log = LoggerFactory.getLogger(ValidationRequestHandler.class);

    private final IMessageBusProducer messageBus;
    private final IValidator validator;
    private final BaseDaoService baseDaoService;
    private final DatasourceFactory datasourceFactory;

    private int totalRows = 0;

    @Autowired
    public ValidationRequestHandler(IValidator validator,
                                    IMessageBusProducer messageBus,
                                    BaseDaoService baseDaoService,
                                    DatasourceFactory datasourceFactory) {
        this.messageBus = messageBus;
        this.validator = validator;
        this.baseDaoService = baseDaoService;
        this.datasourceFactory = datasourceFactory;
    }

    @Override
    public String getEventType() {
        return ValidationRequestEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent mqEvent) {
        log.debug("Start validation");

        final ValidationRequestEvent event = (ValidationRequestEvent) mqEvent;
        try {
            ValidationProcessModel payload = event.getPayload();

            messageBus.produce(new ValidationResponseEvent(event, PENDING, "Инициализация...", 0));

            totalRows = (int) calculateTotalRows(payload.getResourceProjections());
            payload.getResourceProjections()
                   .forEach(resource -> validateResource(event, resource));

            messageBus.produce(new ValidationResponseEvent(event, DONE, "", 100));
        } catch (Exception e) {
            log.error("Не удалось выполнить валидацию.", e);

            messageBus.produce(new ValidationResponseEvent(event, ERROR, e.getMessage()));
        }
    }

    private void validateResource(IMessageBusEvent event, ResourceProjection resource) {
        log.debug("Validate resource: {}", resource.getResourceId());

        final SchemaDto schema = resource.getSchema();

        int processedRows = 0;
        try {
            LocalTime startTime = LocalTime.now();
            JdbcTemplate jdbcTemplate = datasourceFactory.getJdbcTemplate(resource.getDbName());
            baseDaoService.deleteAllRecordsFromExtTableWhichNotExist(jdbcTemplate, resource);

            List<Map<String, Object>> nextBatch;
            int batchSize = DaoProperties.BATCH_SIZE;
            while (true) {
                nextBatch = baseDaoService.fetchBatchOfRowsNeededToValidation(jdbcTemplate, resource, batchSize);
                if (nextBatch.isEmpty()) {
                    break;
                }

                List<ObjectValidationResult> validationResults = validateBatch(nextBatch, schema);
                baseDaoService.saveValidationResults(jdbcTemplate, resource, validationResults);

                messageBus.produce(new ValidationResponseEvent((ValidationRequestEvent) event, PENDING,
                                                               "Обработано: " + schema.getTitle(),
                                                               calculatePercent(processedRows, totalRows)));

                processedRows += batchSize;
            }

            LocalTime endTime = LocalTime.now();
            log.debug("Validation time for resource: {} is: {} seconds", resource, SECONDS.between(startTime, endTime));

            messageBus.produce(
                    new ValidationResponseEvent((ValidationRequestEvent) event, TASK_DONE, "Готово", -1,
                                                resource.toString()));
        } catch (Exception e) {
            log.error("Не удалось провалидировать: {}", resource, e);

            messageBus.produce(
                    new ValidationResponseEvent((ValidationRequestEvent) event, TASK_ERROR, "Ошибка", -1,
                                                resource.toString(), e.getMessage()));
        }
    }

    private List<ObjectValidationResult> validateBatch(List<Map<String, Object>> batch,
                                                       SchemaDto featureDescription) {
        List<ObjectValidationResult> validationResults = new ArrayList<>();

        int i = 0;
        while (i < batch.size()) {
            ObjectValidationResult objectValidationResult = validator.validate(featureDescription, batch.get(i));
            objectValidationResult.setObjectId(Util.getPropertyByKey(batch.get(i), PRIMARY_KEY));
            objectValidationResult.setGlobalId(Util.getPropertyByKey(batch.get(i), GLOBAL_KEY));
            objectValidationResult.setClassId(Util.getPropertyByKey(batch.get(i), CLASS_ID));
            objectValidationResult.setxMin(Util.getPropertyByKey(batch.get(i), "xmin"));

            validationResults.add(objectValidationResult);

            i++;
        }

        return validationResults;
    }

    private long calculateTotalRows(List<ResourceProjection> resources) {
        return resources.stream()
                        .mapToLong(baseDaoService::countTotalRows)
                        .sum();
    }
}
