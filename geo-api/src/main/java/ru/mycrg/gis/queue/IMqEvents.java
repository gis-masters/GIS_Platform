package ru.mycrg.gis.queue;

import ru.mycrg.common.BaseMqProcessRequest;

public interface IMqEvents {

    void sendOrgEvent(BaseMqProcessRequest msg);
    void initImport(BaseMqProcessRequest importMqRequest);
    void sendValidationRequest(BaseMqProcessRequest validationMqRequest);
    void sendGmlInit(BaseMqProcessRequest payload);

}
