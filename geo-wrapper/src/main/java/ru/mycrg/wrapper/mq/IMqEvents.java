package ru.mycrg.wrapper.mq;

import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.OrgMqResponse;

public interface IMqEvents {

    void orgEventResponse(OrgMqResponse response);

    void validationResponse(BaseMqProcessResponse response);

    void importResponse(BaseMqProcessResponse importMqResponse);

    void gmlResponse(BaseMqProcessResponse gmlMqResponse);
}
