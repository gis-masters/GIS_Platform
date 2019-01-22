package ru.geoserver.mq;


import ru.geoserver.service.validation.IConstraintViolation;

import java.util.List;

public interface IMqEvents {

    void created(Long msg);

    void validationResponse(List<IConstraintViolation> violations);

}
