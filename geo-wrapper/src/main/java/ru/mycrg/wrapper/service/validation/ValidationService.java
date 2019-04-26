package ru.mycrg.wrapper.service.validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.common.*;
import ru.mycrg.wrapper.dao.BaseDaoService;
import ru.mycrg.wrapper.dao.DaoProperties;
import ru.mycrg.wrapper.dao.DatasourceFactory;
import ru.mycrg.wrapper.mq.IMqEvents;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

import static ru.mycrg.common.enums.ProcessStatus.*;
import static ru.mycrg.wrapper.service.gml.GmlUtil.calculatePercent;
import static ru.mycrg.wrapper.service.gml.GmlUtil.getRuleByTableName;

@Service
public class ValidationService {

    private static final Logger log = LoggerFactory.getLogger(ValidationService.class);

    private final IMqEvents mqEvents;
    private final IValidator validator;
    private final BaseDaoService baseDaoService;
    private final DatasourceFactory datasourceFactory;

    private int totalRows = 0;
    private int processedRows = 0;

    private Map<String, LocalDateTime> lastCalculatedValidation = new HashMap<>();
    private long totalViolations;
    private boolean isNotValidatedYet = true;

    /**
     * Название ключевой колонки(идентификатор обьекта) в таблицах представляющих слой
     */
    private String OBJECT_ID = "objectid";
    private String CLASS_ID = "classid";

    @Autowired
    public ValidationService(IValidator validator, IMqEvents mqEvents, BaseDaoService baseDaoService,
                             DatasourceFactory datasourceFactory) {
        this.mqEvents = mqEvents;
        this.validator = validator;
        this.baseDaoService = baseDaoService;
        this.datasourceFactory = datasourceFactory;
    }

    /**
     * Валидация слоя.
     *
     * @param mqRequest Запрос
     */
    public void startValidation(ValidationMqRequest mqRequest) {
        log.debug("Start validation");

        totalRows = (int) calculateTotalRows(mqRequest.getResourceProjections());

        mqEvents.validationResponse(new BaseMqProcessResponse(mqRequest.getId(), PENDING, "Инициализация...", 0));

        mqRequest
                .getResourceProjections()
                .forEach(resource -> validateResource(mqRequest, resource, processedRows));

        mqEvents.validationResponse(new BaseMqProcessResponse(mqRequest.getId(), DONE, "", 100));
    }

    private void validateResource(ValidationMqRequest mqRequest, ResourceProjection resource, int processedRows) {
        log.debug("Validate resource: {}", resource.getResourceId());

        try {
            EntityTypeDto feature = getRuleByTableName(mqRequest.getFeatures(), resource.getTableName());

            JdbcTemplate jdbcTemplate = datasourceFactory.getJdbcTemplate(resource.getDbName());

            // определим как будем подсчитывать общее кол-во ошибок в слое.
            if (baseDaoService.isValidated(jdbcTemplate, resource)) {
                totalViolations = baseDaoService.countTotalViolations(jdbcTemplate, resource);
                isNotValidatedYet = false;
            } else {
                totalViolations = 0;
                isNotValidatedYet = true;
            }

            lastCalculatedValidation.put(resource.getResourceId(), LocalDateTime.now());

            Queue<List<ObjectValidationResult>> violationsQueue = new ArrayDeque<>();
            int offset = 0;
            while (true) {
                List<Map<String, Object>> batch = baseDaoService.fetchBatchOfRowsNeededToValidation(jdbcTemplate,
                        resource, DaoProperties.batchSize, offset);
                if (batch.isEmpty()) {
                    break;
                }

                mqEvents.validationResponse(new BaseMqProcessResponse(mqRequest.getId(), PENDING,
                        "Обработка: " + feature.getTitle(),
                        calculatePercent(processedRows, totalRows)));

                violationsQueue.offer(validateBatch(batch, feature));

                processedRows += batch.size();
                offset++;
            }

            // Для подсчета общего кол-ва обьектов с ошибками различаем две ситуации когда слой был провалидирован ранее
            // и когда происходит первая валидация.
            if (isNotValidatedYet) {
                totalViolations = countIncorrectObjects(violationsQueue);
            } else {
                totalViolations = totalViolations - countCorrectObjects(violationsQueue);
            }

            // Сохраняем результаты валидации
            while (true) {
                List<ObjectValidationResult> nextViolations = violationsQueue.poll();
                if (nextViolations != null) {
                    log.debug("Save validation results. Total: {}", totalViolations);

                    mqEvents.validationResponse(new BaseMqProcessResponse(mqRequest.getId(), PENDING,
                            "Сохранение: " + feature.getTitle(),
                            calculatePercent(processedRows, totalRows)));

                    baseDaoService.saveValidationResults(jdbcTemplate, resource, nextViolations);
                } else {
                    break;
                }
            }

            mqEvents.validationResponse(
                    new BaseMqProcessResponse(mqRequest.getId(), SUB_DONE, resource.getTableName(), -1));
        } catch (Exception e) {
            log.error("Не удалось провалидировать: " + resource.getTableName(), e);
            mqEvents.validationResponse(
                    new BaseMqProcessResponse(mqRequest.getId(), ERROR, resource.getTableName(), -1));
        }
    }

    /**
     * Выборка результатов валидации.<ul>
     *
     * <li>- Все обьекты с ошибками
     * <li>- Время последней проверки
     *
     * @param mqRequest Запрос
     */
    public ValidationMqResponse getResults(ValidationMqRequest mqRequest) throws IOException {
        // JdbcTemplate jdbcTemplate = datasourceFactory.getJdbcTemplate(mqRequest.getDbName());

        ValidationMqResponse response = new ValidationMqResponse(mqRequest);

//        Long totalViolations = baseDaoService.countTotalViolations(jdbcTemplate, mqRequest);
//        if (totalViolations > 0) {
//            List<Map<String, Object>> violations = baseDaoService.getViolations(mqRequest);
//
//            log.info("Found {} violations", violations.size());
//            response.setResults(Util.mapToViolations(violations));
//            response.setValidated(true);
//        } else {
//            response.setValidated(baseDaoService.isValidated(jdbcTemplate, mqRequest));
//        }
//
//        LocalDateTime localDateTime = lastCalculatedValidation.get(response.getResourceId());
//        response.setLastValidated(localDateTime != null ? localDateTime.toString() : null);
//        response.setTotal(totalViolations);
//        response.setStatus(ProcessStatus.DONE);

        return response;
    }

    /**
     * Подгатавливаем ответ на информационный запрос.<ul>
     * <li>- Общее кол-во ошибок слоя
     * <li>- Время последней проверки
     *
     * @param mqRequest Запрос
     */
    public ValidationMqResponse getInfo(ValidationMqRequest mqRequest) {
//        JdbcTemplate jdbcTemplate = datasourceFactory.getJdbcTemplate(mqRequest.getDbName());

        ValidationMqResponse response = new ValidationMqResponse(mqRequest);

//        response.setValidated(baseDaoService.isValidated(jdbcTemplate, mqRequest));
//        response.setTotal(baseDaoService.countTotalViolations(jdbcTemplate, mqRequest));
//
//        LocalDateTime localDateTime = lastCalculatedValidation.get(response.getResourceId());
//        response.setLastValidated(localDateTime != null ? localDateTime.toString() : null);
//        response.setStatus(ProcessStatus.DONE);

        return response;
    }

    private List<ObjectValidationResult> validateBatch(List<Map<String, Object>> batch, EntityTypeDto entityType) {
        List<ObjectValidationResult> validationResults = new ArrayList<>();

        int i = 0;
        while (i < batch.size()) {
            ObjectValidationResult objectValidationResult = validator.validate(entityType, batch.get(i));
            objectValidationResult.setObjectId(Util.getPropertyByKey(batch.get(i), OBJECT_ID));
            objectValidationResult.setClassId(Util.getPropertyByKey(batch.get(i), CLASS_ID));
            objectValidationResult.setxMin(Util.getPropertyByKey(batch.get(i), "xmin"));

            validationResults.add(objectValidationResult);

            i++;
        }

        return validationResults;
    }

    private long countCorrectObjects(Queue<List<ObjectValidationResult>> validationResult) {
        return validationResult
                .stream()
                .flatMap(Collection::stream)
                .filter(objectViolation -> objectViolation.getPropertyViolations().isEmpty())
                .count();
    }

    private long countIncorrectObjects(Queue<List<ObjectValidationResult>> validationResult) {
        return validationResult
                .stream()
                .flatMap(Collection::stream)
                .filter(objectViolation -> !objectViolation.getPropertyViolations().isEmpty())
                .count();
    }

    private long calculateTotalRows(List<ResourceProjection> resources) {
        return resources.stream()
                .mapToLong(baseDaoService::countTotalRows)
                .sum();
    }

}
