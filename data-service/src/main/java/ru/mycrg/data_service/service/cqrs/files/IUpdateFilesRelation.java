package ru.mycrg.data_service.service.cqrs.files;

import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.service.IQualifiable;
import ru.mycrg.data_service.service.ISchemable;

public interface IUpdateFilesRelation extends ISchemable, IQualifiable {

    IRecord getNewRecord();

    IRecord getOldRecord();

    void setOldRecord(IRecord oldRecord);
}
