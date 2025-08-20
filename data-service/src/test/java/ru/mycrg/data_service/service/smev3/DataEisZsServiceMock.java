package ru.mycrg.data_service.service.smev3;

import ru.mycrg.data_service.dto.record.IRecord;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Класс эмулирует работу с БД.
 * content - то, что должно быть сохранено в БД. По итогу обработки тут будет находиться весь полученный контент.
 * Можно использовать в тестировании
 */
public class DataEisZsServiceMock implements DataEisZsService {

    private List<Map<String, Object>> content = new ArrayList<>();

    public List<Map<String, Object>> getContent() {
        return content;
    }

    @Override
    public void updateExists(String fieldName, IRecord recordXml) {
        this.content = List.of(recordXml.getContent());
    }

    @Override
    public void addOrIgnoreRecords(String fieldName, List<IRecord> recordsXml) {
        this.content = recordsXml.stream().map(IRecord::getContent).collect(Collectors.toList());
    }
}
