package ru.mycrg.gis.queue;

import ru.mycrg.common.ValidationMqRequest;
import ru.mycrg.gis.dto.MqOrganizationInit;

import java.util.Optional;

public interface IMqEvents {

    void initCreation(MqOrganizationInit msg);

    void startValidation(Optional<ValidationMqRequest> validationMqRequest);

}
