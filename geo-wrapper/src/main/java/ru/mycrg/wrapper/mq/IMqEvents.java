package ru.mycrg.wrapper.mq;

import ru.mycrg.common.ValidationMqResponse;
import ru.mycrg.wrapper.dto.ViolationsSaveDto;

public interface IMqEvents {

    void created(Long msg);

    void validationResponse(ValidationMqResponse response);

    void sandValidationToSave(ViolationsSaveDto saveDto);

}
