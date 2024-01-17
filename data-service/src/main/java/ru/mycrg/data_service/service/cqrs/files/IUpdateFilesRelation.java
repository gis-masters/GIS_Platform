package ru.mycrg.data_service.service.cqrs.files;

import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.service.resources.IQualifiable;
import ru.mycrg.data_service.service.schemas.ISchemable;

public interface IUpdateFilesRelation extends ISchemable, IQualifiable {

    IRecord getNewRecord();

    IRecord getOldRecord();

    void setOldRecord(IRecord oldRecord);
}
