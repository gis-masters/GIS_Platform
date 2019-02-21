package ru.mycrg.gis.queue;

import ru.mycrg.common.ValidationMqRequest;
import ru.mycrg.gis.dto.MqOrganizationInit;

public interface IMqEvents {

    void initCreation(MqOrganizationInit msg);

    void sendValidationRequest(ValidationMqRequest validationMqRequest);

}
