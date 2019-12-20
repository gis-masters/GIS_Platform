package ru.mycrg.mq_queue_contract;

public interface Processable {

    void handleMqResponse(BaseMqProcessResponse mqResponse);
}
