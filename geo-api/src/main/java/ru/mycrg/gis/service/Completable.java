package ru.mycrg.gis.service;

import ru.mycrg.common.BaseMqProcessResponse;

public interface Completable {

    void complete(BaseMqProcessResponse mqResponse);
}
