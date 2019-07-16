package ru.mycrg.wrapper.service.export;

import ru.mycrg.common.MqExportProcessRequest;
import ru.mycrg.wrapper.exceptions.ExportException;

public interface IExporter {

    String generate(MqExportProcessRequest request) throws ExportException;
}
