package ru.mycrg.wrapper.mq;

import ru.mycrg.common.ValidationMqResponse;

public interface IMqEvents {

    void created(Long msg);

    void validationResponse(ValidationMqResponse response);

}
