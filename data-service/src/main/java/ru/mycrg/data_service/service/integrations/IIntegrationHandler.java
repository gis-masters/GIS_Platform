package ru.mycrg.data_service.service.integrations;

import ru.mycrg.data_service.entity.RecordEntity;

public interface IIntegrationHandler {

    void execute(RecordEntity record) throws InterruptedException;

    String getType();
}
