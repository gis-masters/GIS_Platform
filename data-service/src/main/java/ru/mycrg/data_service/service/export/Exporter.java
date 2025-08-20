package ru.mycrg.data_service.service.export;

import ru.mycrg.data_service.dto.ExportRequestModel;
import ru.mycrg.data_service.entity.Process;

public interface Exporter {

    Process doExport(ExportRequestModel model);

    ExportType getType();
}
