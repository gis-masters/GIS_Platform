package ru.mycrg.wrapper.service.validation;

import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.dto.ObjectValidationResult;

import java.util.Map;

public interface IValidator {

    ObjectValidationResult validate(SchemaDto schemaDto, Map<String, Object> data);
}
