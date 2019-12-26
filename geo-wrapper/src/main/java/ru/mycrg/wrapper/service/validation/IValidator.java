package ru.mycrg.wrapper.service.validation;

import ru.mycrg.mq_queue_contract.SchemaDto;
import ru.mycrg.mq_queue_contract.ObjectValidationResult;

import java.util.Map;

public interface IValidator {

    ObjectValidationResult validate(SchemaDto schemaDto, Map<String, Object> data);

}
