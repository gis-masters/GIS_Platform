package ru.mycrg.data_service.service.records;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dto.RecordDto;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.entity.RecordEntity;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.util.Map;

public interface IRecordsService {

    Page<RecordDto> getPaged(ResourceQualifier lQualifier,
                             Pageable pageable,
                             Long parentId,
                             String ecqlFilter);

    Page<RecordDto> getAsRegistry(ResourceQualifier lQualifier,
                                  Pageable newPageable,
                                  String ecqlFilter);

    /**
     * Возвращает запись из библиотеки при наличии к ней доступа.
     *
     * @param rQualifier Квалификатор библиотеки
     * @param recordId   Идентификатор записи
     */
    Map<String, Object> getById(ResourceQualifier rQualifier, Long recordId);

    IRecord createRecord(ResourceQualifier lQualifier,
                         RecordEntity record,
                         MultipartFile file);

    /**
     * Update record.
     *
     * @param recordQualifier Идентификатор записи в библиотеке
     * @param payload         Данные для обновления
     */
    void updateRecord(ResourceQualifier recordQualifier, Map<String, Object> payload);

    void deleteRecord(ResourceQualifier resourceQualifier, Long id) throws CrgDaoException;
}
