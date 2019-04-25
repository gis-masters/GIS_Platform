package ru.mycrg.gis.queue;

import ru.mycrg.common.BaseMqRequest;
import ru.mycrg.common.GmlMqRequest;
import ru.mycrg.common.OrgMqRequest;
import ru.mycrg.common.ValidationMqRequest;
import ru.mycrg.common.import_.ImportMqRequest;

public interface IMqEvents {

    void sendOrgEvent(OrgMqRequest msg);

    void initImport(BaseMqRequest importMqRequest);

    void sendValidationRequest(BaseMqRequest validationMqRequest);

    void sendGmlInit(BaseMqRequest payload);

}
