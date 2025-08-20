package ru.mycrg.wrapper.service.export;

import ru.mycrg.data_service_contract.queue.request.ExportRequestEvent;

public interface IExporter {

    String generate(ExportRequestEvent event);
}
