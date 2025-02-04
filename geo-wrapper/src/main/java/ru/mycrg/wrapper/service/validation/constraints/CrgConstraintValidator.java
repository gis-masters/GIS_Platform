package ru.mycrg.wrapper.service.validation.constraints;

import ru.mycrg.data_service_contract.dto.SimplePropertyDto;

import java.util.List;

public interface CrgConstraintValidator {

    boolean isValid(Object value, SimplePropertyDto context);

    void validate(Object value, SimplePropertyDto context, List<String> violations);
}
