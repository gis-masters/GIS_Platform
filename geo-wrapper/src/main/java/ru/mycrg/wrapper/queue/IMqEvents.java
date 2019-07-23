package ru.mycrg.wrapper.queue;

import ru.mycrg.common.BaseMqProcessResponse;

public interface IMqEvents {

    void send(String fanout, String key, BaseMqProcessResponse response);

//    void orgEventResponse(OrgMqResponse response);
//
//    void validationResponse(ValidationMqResponse response);
//
//    void importResponse(ImportMqResponse importMqResponse);
//
//    void gmlResponse(BaseMqProcessResponse gmlMqResponse);
}
