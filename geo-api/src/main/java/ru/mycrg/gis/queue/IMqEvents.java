package ru.mycrg.gis.queue;

import ru.mycrg.common.BaseMqProcessRequest;
import ru.mycrg.common.OrgMqProcessRequest;

public interface IMqEvents {

    void sendOrgEvent(OrgMqProcessRequest msg);
    void initImport(BaseMqProcessRequest importMqRequest);
    void sendValidationRequest(BaseMqProcessRequest validationMqRequest);
    void sendGmlInit(BaseMqProcessRequest payload);

}
