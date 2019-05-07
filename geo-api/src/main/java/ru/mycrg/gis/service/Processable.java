package ru.mycrg.gis.service;

import ru.mycrg.common.BaseMqProcessResponse;

public interface Processable {

    void handleMqResponse(BaseMqProcessResponse mqResponse);
}
