package ru.mycrg.wrapper.service.validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.common.*;
import ru.mycrg.common.enums.ProcessStatus;
import ru.mycrg.wrapper.dao.BaseDaoService;
import ru.mycrg.wrapper.dao.DaoProperties;
import ru.mycrg.wrapper.dao.DatasourceFactory;
import ru.mycrg.wrapper.mq.IMqEvents;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

import static ru.mycrg.common.enums.ProcessStatus.PENDING;

@Service
@Transactional
public class ValidationService {

    private static final Logger log = LoggerFactory.getLogger(ValidationService.class);

    private final IMqEvents mqEvents;
    private final IValidator validator;
    private final BaseDaoService baseDaoService;
    private final DatasourceFactory datasourceFactory;

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

        JdbcTemplate jdbcTemplate = datasourceFactory.getJdbcTemplate(mqRequest.getDbName());

        ValidationMqResponse response = new ValidationMqResponse(mqRequest);

        mqEvents.validationResponse(new BaseMqProcessResponse(mqRequest.getId(), PENDING, "Инициализация...", 1));

        // определим как будем подсчитывать общее кол-во ошибок в слое.
        if (baseDaoService.isValidated(jdbcTemplate, mqRequest)) {
            totalViolations = baseDaoService.countTotalViolations(jdbcTemplate, mqRequest);
            isNotValidatedYet = false;
        } else {
            totalViolations = 0;
            isNotValidatedYet = true;
        }

        lastCalculatedValidation.put(response.getResourceId(), LocalDateTime.now());
        response.setValidated(true);
        response.setLastValidated(LocalDateTime.now().toString());

        Queue<List<ObjectValidationResult>> violationsQueue = new ArrayDeque<>();
        int offset = 0;
        while (true) {
            response.setResults(new ArrayList<>());

            List<Map<String, Object>> batch = baseDaoService.fetchBatchOfRowsNeededToValidation(jdbcTemplate,
                    mqRequest, DaoProperties.batchSize, offset);
            if (batch.isEmpty()) {
                break;
            }

            mqEvents.validationResponse(new BaseMqProcessResponse(mqRequest.getId(), PENDING, "Выборка...", 1));
            violationsQueue.offer(validateBatch(batch, mqRequest.getEntityType()));

            offset++;
        }

        // Для подсчета общего кол-ва обьектов с ошибками различаем две ситуации когда слой был провалидирован ранее
        // и когда происходит первая валидация.
        if (isNotValidatedYet) {
            totalViolations = countIncorrectObjects(violationsQueue);
        } else {
            totalViolations = totalViolations - countCorrectObjects(violationsQueue);
        }

        log.debug("Save validation results. Total: {}", totalViolations);

        // Сохраняем результаты валидации
        while (true) {
            List<ObjectValidationResult> nextViolations = violationsQueue.poll();
            if (nextViolations != null) {
                sendPendingResponse(mqRequest, nextViolations);

                baseDaoService.saveValidationResults(jdbcTemplate, mqRequest, nextViolations);
            } else {
                response.setTotal(totalViolations);
                response.setStatus(ProcessStatus.DONE);

                mqEvents.validationResponse(response);
                break;
            }
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
        JdbcTemplate jdbcTemplate = datasourceFactory.getJdbcTemplate(mqRequest.getDbName());

        ValidationMqResponse response = new ValidationMqResponse(mqRequest);

        Long totalViolations = baseDaoService.countTotalViolations(jdbcTemplate, mqRequest);
        if (totalViolations > 0) {
            List<Map<String, Object>> violations = baseDaoService.getViolations(mqRequest);

            log.info("Found {} violations", violations.size());
            response.setResults(Util.mapToViolations(violations));
            response.setValidated(true);
        } else {
            response.setValidated(baseDaoService.isValidated(jdbcTemplate, mqRequest));
        }

        LocalDateTime localDateTime = lastCalculatedValidation.get(response.getResourceId());
        response.setLastValidated(localDateTime != null ? localDateTime.toString() : null);
        response.setTotal(totalViolations);
        response.setStatus(ProcessStatus.DONE);

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
        JdbcTemplate jdbcTemplate = datasourceFactory.getJdbcTemplate(mqRequest.getDbName());

        ValidationMqResponse response = new ValidationMqResponse(mqRequest);

        response.setValidated(baseDaoService.isValidated(jdbcTemplate, mqRequest));
        response.setTotal(baseDaoService.countTotalViolations(jdbcTemplate, mqRequest));

        LocalDateTime localDateTime = lastCalculatedValidation.get(response.getResourceId());
        response.setLastValidated(localDateTime != null ? localDateTime.toString() : null);
        response.setStatus(ProcessStatus.DONE);

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

    private void sendPendingResponse(ValidationMqRequest validationMqRequest,
                                     List<ObjectValidationResult> violationResults) {
        ValidationMqResponse pendingResponse = new ValidationMqResponse(validationMqRequest);
        pendingResponse.setStatus(ProcessStatus.PENDING);
        pendingResponse.setResults(violationResults);

        mqEvents.validationResponse(pendingResponse);
    }
}
