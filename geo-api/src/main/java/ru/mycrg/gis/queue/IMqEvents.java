package ru.mycrg.gis.queue;

import ru.mycrg.common.GmlMqRequest;
import ru.mycrg.common.OrgMqRequest;
import ru.mycrg.common.ValidationMqRequest;
import ru.mycrg.common.import_.ImportMqRequest;

public interface IMqEvents {

    void sendOrgEvent(OrgMqRequest msg);

    void initImport(ImportMqRequest importMqRequest);

    void sendValidationRequest(ValidationMqRequest validationMqRequest);

    void sendGmlInit(GmlMqRequest payload);

}
