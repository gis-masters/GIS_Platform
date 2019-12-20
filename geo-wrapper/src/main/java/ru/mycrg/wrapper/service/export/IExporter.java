package ru.mycrg.wrapper.service.export;

import ru.mycrg.mq_queue_contract.BaseMqProcessRequest;
import ru.mycrg.wrapper.exceptions.ExportException;

public interface IExporter {

    String generate(BaseMqProcessRequest request) throws ExportException;
}
