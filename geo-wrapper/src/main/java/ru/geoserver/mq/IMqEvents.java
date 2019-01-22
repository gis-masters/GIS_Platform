package ru.geoserver.mq;

import ru.mycrg.common.ValidationResponse;

public interface IMqEvents {

    void created(Long msg);

    void validationResponse(ValidationResponse response);

}
