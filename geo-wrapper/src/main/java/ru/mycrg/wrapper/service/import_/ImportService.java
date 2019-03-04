package ru.mycrg.wrapper.service.import_;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.common.enums.ProcessStatus;
import ru.mycrg.common.import_.ImportMqRequest;
import ru.mycrg.common.import_.ImportMqResponse;
import ru.mycrg.wrapper.dao.PostGisStorage;
import ru.mycrg.wrapper.mq.IMqEvents;

@Service
@Transactional
public class ImportService {

    private static final Logger log = LoggerFactory.getLogger(ImportService.class);

    private final IMqEvents mqEvents;
    private final PostGisStorage postGisStorage;

    public ImportService(PostGisStorage postGisStorage, IMqEvents mqEvents) {
        this.postGisStorage = postGisStorage;
        this.mqEvents = mqEvents;
    }

    /**
     * При импорте выполняется:
     *  - Очистка целевой таблицы и таблицы с данными валидации (*_extension)
     *  - Добавление в рабочую таблицу колонок которые имеют тип импорта "AsIs"
     *  - Перенос из исходной таблицы в рабочую
     *  - Проверка и при необходимости генерация GLOBALID
     */
    public void doImport(ImportMqRequest request) {
        log.info("Try import from: {} to: {}", request.sourceToString(), request.targetToString());

        try {
            postGisStorage.doImport(request);

            mqEvents.importResponse(
                    new ImportMqResponse(
                            request.getId(),
                            request.getSourceResource().getTableName(),
                            ProcessStatus.DONE));
        } catch (Exception e) {
            log.error("Ошибка при импорте: {}", e.getLocalizedMessage());

            mqEvents.importResponse(
                    new ImportMqResponse(
                            request.getId(),
                            request.getSourceResource().getTableName(),
                            ProcessStatus.ERROR));
        }
    }
}
