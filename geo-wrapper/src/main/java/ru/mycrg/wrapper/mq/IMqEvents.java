package ru.mycrg.wrapper.mq;

import ru.mycrg.common.GmlResponseDto;
import ru.mycrg.common.ValidationMqResponse;
import ru.mycrg.common.import_.ImportMqResponse;

import java.util.List;

public interface IMqEvents {

    void created(Long msg);

    void validationResponse(ValidationMqResponse response);

    void importResponse(ImportMqResponse importMqResponse);

    void gmlResponse(GmlResponseDto gmlResponseDto);
}
