package ru.mycrg.wrapper.service.validation;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.common.*;
import ru.mycrg.common.enums.ValidationStatus;
import ru.mycrg.wrapper.dao.PostGisStorage;
import ru.mycrg.wrapper.dto.ViolationsSaveDto;
import ru.mycrg.wrapper.mq.IMqEvents;

import java.io.IOException;
import java.util.*;

@Service
@Transactional
public class ValidationService {

    private static final Logger log = LoggerFactory.getLogger(ValidationService.class);

    private final IMqEvents mqEvents;
    private final IValidator validator;
    private final PostGisStorage postGisStorage;

    private final int BATCH_SIZE = 100;

    /**
     * Название ключевой колонки(идентификатор обьекта) в таблицах представляющих слой
     */
    private String OBJECT_ID = "objectid";
    private String CLASS_ID = "classid";

    /**
     * Название колонки(идентификатор обьекта) в таблицах содержащих данные по валидации('_extension')
     */
    private String EXTENSION_OBJECTID_KEY = "object_id";
    private String EXTENSION_CLASSID_KEY = "class_id";

    /**
     * Название колонки содержащей описание ошибок валидации.
     */
    private String VIOLATIONS_KEY = "violations";

    @Autowired
    public ValidationService(IValidator validator, IMqEvents mqEvents, PostGisStorage postGisStorage) {
        this.mqEvents = mqEvents;
        this.validator = validator;
        this.postGisStorage = postGisStorage;
    }

    public void getResults(ValidationMqRequest validationMqRequest) throws IOException {
        ValidationMqResponse response = new ValidationMqResponse(validationMqRequest.getId());

        Long totalViolations = postGisStorage.countTotalViolations(validationMqRequest);
        if (totalViolations > 0) {
            List<Map<String, Object>> violations = postGisStorage.getViolations(validationMqRequest);

            log.info("Found {} violations", violations.size());
            response.setResults(mapToViolations(violations));
        }

        response.setTotal(totalViolations);
        response.setStatus(ValidationStatus.DONE);

        mqEvents.validationResponse(response);
    }

    public void startValidation(ValidationMqRequest validationMqRequest) {
        ValidationMqResponse response = new ValidationMqResponse(validationMqRequest.getId());

        int offset = 0;
        while (true) {
            response.setResults(new ArrayList<>());

            var batch = postGisStorage.fetchBatchOfRowsNeededToValidation(validationMqRequest, BATCH_SIZE, offset);
            if (batch.isEmpty()) {
                break;
            }

            List<ObjectValidationResult> violationResults = validateBatch(batch, validationMqRequest.getEntityType());

            sendPendingResponse(validationMqRequest, violationResults);

            if (!violationResults.isEmpty()) {
                mqEvents.sandValidationToSave(new ViolationsSaveDto(validationMqRequest, violationResults));
            } else {
                log.debug("No violations found in batch:{}. Nothing to save.", offset);
            }

            offset++;
        }

        // TODO: Недело кончено что посути мы ответили DONE а сохранилось оно или упало неизвестно, но пока упущу этот момент
        response.setStatus(ValidationStatus.DONE);

        mqEvents.validationResponse(response);
    }

    public void saveViolations(ViolationsSaveDto dto) throws NumberFormatException {
        postGisStorage.saveValidationResults(dto, EXTENSION_OBJECTID_KEY);
    }

    private void sendPendingResponse(ValidationMqRequest validationMqRequest,
                                     List<ObjectValidationResult> violationResults) {
        ValidationMqResponse pendingResponse = new ValidationMqResponse(validationMqRequest.getId());
        pendingResponse.setStatus(ValidationStatus.PENDING);
        pendingResponse.setResults(violationResults);

        mqEvents.validationResponse(pendingResponse);
    }

    private List<ObjectValidationResult> mapToViolations(List<Map<String, Object>> violations) throws IOException {
        List<ObjectValidationResult> results = new ArrayList<>();

        int i = 0;
        while (i < violations.size()) {
            ObjectValidationResult objectValidationResult = new ObjectValidationResult();
            objectValidationResult.setObjectId(Util.getPropertyByKey(violations.get(i), EXTENSION_OBJECTID_KEY));
            objectValidationResult.setClassId(Util.getPropertyByKey(violations.get(i), EXTENSION_CLASSID_KEY));

            String violationsAsString = Util.getViolations(violations.get(i), VIOLATIONS_KEY);

            ObjectMapper mapper = new ObjectMapper();
            PropertyViolation[] data = mapper.readValue(violationsAsString, PropertyViolation[].class);

            objectValidationResult.setViolations(List.of(data));

            results.add(objectValidationResult);

            i++;
        }

        return results;
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
}
