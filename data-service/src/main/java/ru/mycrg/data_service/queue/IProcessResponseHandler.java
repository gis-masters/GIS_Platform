package ru.mycrg.data_service.queue;

import ru.mycrg.mq_queue_contract.BaseMqProcessResponse;

public interface IProcessResponseHandler {
    void handle(BaseMqProcessResponse mqResponse);
}
