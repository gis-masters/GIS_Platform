package ru.mycrg.data_service.service.cqrs.files;

import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.service.resources.IQualifiable;
import ru.mycrg.data_service.service.schemas.ISchemable;

public interface IDeleteFilesRelation extends ISchemable, IQualifiable {

    IRecord getRecord();
}
