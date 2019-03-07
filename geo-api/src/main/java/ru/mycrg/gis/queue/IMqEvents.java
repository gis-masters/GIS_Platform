package ru.mycrg.gis.queue;

import ru.mycrg.common.ResourceProjection;
import ru.mycrg.common.ValidationMqRequest;
import ru.mycrg.common.import_.ImportMqRequest;
import ru.mycrg.gis.dto.MqOrganizationInit;
import ru.mycrg.gis.service.import_.ImportTask;

import java.util.List;

public interface IMqEvents {

    void initCreation(MqOrganizationInit msg);

    void initImport(ImportMqRequest importMqRequest);

    void sendValidationRequest(ValidationMqRequest validationMqRequest);

    void sendGmlInit(List<ResourceProjection> payload);

}
