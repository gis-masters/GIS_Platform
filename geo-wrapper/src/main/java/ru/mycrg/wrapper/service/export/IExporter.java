package ru.mycrg.wrapper.service.export;

import ru.mycrg.common.MqExportProcessRequest;
import ru.mycrg.wrapper.exceptions.ExportException;

import java.util.Map;

public interface IExporter {

    Map<String, String> generate(MqExportProcessRequest request) throws ExportException;
}
