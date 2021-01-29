package ru.mycrg.wrapper.service.export;

import ru.mycrg.mq_queue_contract.BaseMqProcessRequest;

public interface IExporter {

    String generate(BaseMqProcessRequest request);
}
