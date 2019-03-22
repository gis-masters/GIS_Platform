package ru.mycrg.wrapper.service.validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.common.EntityTypeDto;
import ru.mycrg.common.ObjectValidationResult;
import ru.mycrg.common.ValidationMqRequest;
import ru.mycrg.common.ValidationMqResponse;
import ru.mycrg.common.enums.ProcessStatus;
import ru.mycrg.wrapper.dao.GisStorage;
import ru.mycrg.wrapper.mq.IMqEvents;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
public class ValidationService {

    private static final Logger log = LoggerFactory.getLogger(ValidationService.class);

    private final IMqEvents mqEvents;
    private final IValidator validator;
    private final GisStorage gisStorage;

    private Map<String, LocalDateTime> lastCalculatedValidation = new HashMap<>();
    private Queue<List<ObjectValidationResult>> violationsQueue = new ArrayDeque<>();
    private long totalViolations;
    private boolean isNotValidatedYet = true;

    private final int BATCH_SIZE = 100;

    /**
     * Название ключевой колонки(идентификатор обьекта) в таблицах представляющих слой
     */
    private String OBJECT_ID = "objectid";
    private String CLASS_ID = "classid";

    @Autowired
    public ValidationService(IValidator validator, IMqEvents mqEvents, GisStorage gisStorage) {
        this.mqEvents = mqEvents;
        this.validator = validator;
        this.gisStorage = gisStorage;
    }

    /**
     * Валидация слоя.
     *
     * @param validationMqRequest Запрос
     */
    public void startValidation(ValidationMqRequest validationMqRequest) {
        ValidationMqResponse response = new ValidationMqResponse(validationMqRequest);

        // определим как будем подсчитывать общее кол-во ошибок в слое.
        if (gisStorage.isValidated(validationMqRequest)) {
            totalViolations = gisStorage.countTotalViolations(validationMqRequest);
            isNotValidatedYet = false;
        } else {
            totalViolations = 0;
            isNotValidatedYet = true;
        }

        lastCalculatedValidation.put(response.getResourceId(), LocalDateTime.now());
        response.setValidated(true);
        response.setLastValidated(LocalDateTime.now().toString());

        int offset = 0;
        while (true) {
            response.setResults(new ArrayList<>());

            List<Map<String, Object>> batch = gisStorage
                    .fetchBatchOfRowsNeededToValidation(validationMqRequest, BATCH_SIZE, offset);
            if (batch.isEmpty()) {
                break;
            }

            violationsQueue.offer(validateBatch(batch, validationMqRequest.getEntityType()));

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
                sendPendingResponse(validationMqRequest, nextViolations);

                gisStorage.saveValidationResults(validationMqRequest, nextViolations);
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
     * @param validationMqRequest Запрос
     */
    public ValidationMqResponse getResults(ValidationMqRequest validationMqRequest) throws IOException {
        ValidationMqResponse response = new ValidationMqResponse(validationMqRequest);

        Long totalViolations = gisStorage.countTotalViolations(validationMqRequest);
        if (totalViolations > 0) {
            List<Map<String, Object>> violations = gisStorage.getViolations(validationMqRequest);

            log.info("Found {} violations", violations.size());
            response.setResults(Util.mapToViolations(violations));
            response.setValidated(true);
        } else {
            response.setValidated(gisStorage.isValidated(validationMqRequest));
        }

        LocalDateTime localDateTime = lastCalculatedValidation.get(response.getResourceId());
        response.setLastValidated(localDateTime != null ? localDateTime.toString(): null);
        response.setTotal(totalViolations);
        response.setStatus(ProcessStatus.DONE);

        return response;
    }

    /**
     * Подгатавливаем ответ на информационный запрос.<ul>
     * <li>- Общее кол-во ошибок слоя
     * <li>- Время последней проверки
     *
     * @param validationMqRequest Запрос
     */
    public ValidationMqResponse getInfo(ValidationMqRequest validationMqRequest) {
        ValidationMqResponse response = new ValidationMqResponse(validationMqRequest);

        response.setValidated(gisStorage.isValidated(validationMqRequest));
        response.setTotal(gisStorage.countTotalViolations(validationMqRequest));

        LocalDateTime localDateTime = lastCalculatedValidation.get(response.getResourceId());
        response.setLastValidated(localDateTime != null ? localDateTime.toString(): null);
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
