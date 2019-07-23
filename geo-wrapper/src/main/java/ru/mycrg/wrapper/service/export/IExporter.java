package ru.mycrg.wrapper.service.export;

import ru.mycrg.common.BaseMqProcessRequest;
import ru.mycrg.wrapper.exceptions.ExportException;

public interface IExporter {

    String generate(BaseMqProcessRequest request) throws ExportException;
}
