package ru.mycrg.wrapper.mq;

import ru.mycrg.common.GmlMqResponse;
import ru.mycrg.common.ValidationMqResponse;
import ru.mycrg.common.import_.ImportMqResponse;

public interface IMqEvents {

    void created(Long msg);

    void validationResponse(ValidationMqResponse response);

    void importResponse(ImportMqResponse importMqResponse);

    void gmlResponse(GmlMqResponse gmlMqResponse);
}
