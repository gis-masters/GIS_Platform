package ru.mycrg.data_service.service.document_library;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.DocumentVersioningDto;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.List;

public interface IRecordsService {

    Page<IRecord> getPaged(ResourceQualifier lQualifier,
                           Pageable pageable,
                           Long parentId,
                           String ecqlFilter);

    Page<IRecord> getAsRegistry(ResourceQualifier lQualifier,
                                Pageable newPageable,
                                String ecqlFilter);

    /**
     * Возвращает запись из библиотеки при наличии к ней доступа.
     *
     * @param rQualifier Квалификатор библиотеки
     * @param recordId   Идентификатор записи
     */
    // TODO: Удалить второй параметр: Object recordId. Уже сейчас зачастую id есть в ResourceQualifier. Ну а в
    //  дальнейшем это в целом верный путь - задать корректный ResourceQualifier с id.
    IRecord getById(ResourceQualifier rQualifier,
                    Object recordId);

    IRecord getById(ResourceQualifier rQualifier,
                    Object recordId,
                    SchemaDto schema);

    List<DocumentVersioningDto> getVersionsByRecordId(ResourceQualifier rQualifier,
                                                      Object recordId);

    IRecord createRecord(ResourceQualifier lQualifier,
                         IRecord record,
                         SchemaDto schema);

    /**
     * Update record.
     *
     * @param recordQualifier Идентификатор записи в библиотеке
     * @param payload         Данные для обновления
     */
    void updateRecord(ResourceQualifier recordQualifier,
                      IRecord payload,
                      SchemaDto schema);

    void deleteRecord(ResourceQualifier qualifier,
                      SchemaDto schema) throws CrgDaoException;

    void recoverRecord(ResourceQualifier qualifier,
                       SchemaDto schema,
                       String recoverPath) throws CrgDaoException;
}
