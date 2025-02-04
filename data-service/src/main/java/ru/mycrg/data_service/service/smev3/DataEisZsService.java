package ru.mycrg.data_service.service.smev3;

import ru.mycrg.data_service.dto.record.IRecord;

import java.util.List;

public interface DataEisZsService {
    void updateExists(String fieldName, IRecord recordXml);

    void addOrIgnoreRecords(String fieldName, List<IRecord> recordsXml);
}
