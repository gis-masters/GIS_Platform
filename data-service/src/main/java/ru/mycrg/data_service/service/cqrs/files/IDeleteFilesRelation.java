package ru.mycrg.data_service.service.cqrs.files;

import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.service.IQualifiable;
import ru.mycrg.data_service.service.ISchemable;

public interface IDeleteFilesRelation extends ISchemable, IQualifiable {

    IRecord getRecord();
}
