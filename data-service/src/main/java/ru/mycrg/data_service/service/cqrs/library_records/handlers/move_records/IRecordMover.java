package ru.mycrg.data_service.service.cqrs.library_records.handlers.move_records;

import ru.mycrg.data_service.service.resources.ResourceQualifier;

public interface IRecordMover {

    void move(ResourceQualifier recordToMoveQualifier, ResourceQualifier targetRecordQualifier);
}
