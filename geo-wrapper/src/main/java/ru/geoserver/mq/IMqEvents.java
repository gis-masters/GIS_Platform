package ru.geoserver.mq;


import ru.mycrg.common.ConstraintViolation;

import java.util.List;

public interface IMqEvents {

    void created(Long msg);

    void validationResponse(List<ConstraintViolation> violations);

}
