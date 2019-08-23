package ru.mycrg.wrapper.service.export;

import ru.mycrg.common.BaseMqProcessRequest;
import ru.mycrg.wrapper.exceptions.CrgExportException;

public interface IExporter {

    String generate(BaseMqProcessRequest request) throws CrgExportException;
}
