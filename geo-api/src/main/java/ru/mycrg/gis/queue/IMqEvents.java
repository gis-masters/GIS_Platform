package ru.mycrg.gis.queue;

import ru.mycrg.common.GmlInitDto;
import ru.mycrg.common.ValidationMqRequest;
import ru.mycrg.common.import_.ImportMqRequest;
import ru.mycrg.gis.dto.MqOrganizationInit;

public interface IMqEvents {

    void initCreation(MqOrganizationInit msg);

    void initImport(ImportMqRequest importMqRequest);

    void sendValidationRequest(ValidationMqRequest validationMqRequest);

    void sendGmlInit(GmlInitDto payload);

}
