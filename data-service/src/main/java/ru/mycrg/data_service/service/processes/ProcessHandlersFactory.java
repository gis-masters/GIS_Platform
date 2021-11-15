package ru.mycrg.data_service.service.processes;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.entity.RecordEntity;
import ru.mycrg.data_service.service.records.UserRecordsService;
import ru.mycrg.data_service.service.processes.dto.ImportInitializingModel;
import ru.mycrg.data_service.service.processes.dto.ImportSource;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.validators.ImportModelValidator;
import ru.mycrg.data_service_contract.enums.ProcessType;

import java.util.List;
import java.util.Map;
import java.util.function.Function;

import static java.util.stream.Collectors.toMap;
import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;

@Component
public class ProcessHandlersFactory {

    private final UserRecordsService recordsService;
    private final IProcessHandler defaultProcessHandler;
    private final Map<ProcessType, IProcessHandler> processHandlers;

    public ProcessHandlersFactory(UserRecordsService recordsService,
                                  DefaultProcessHandler defaultProcessHandler,
                                  List<IProcessHandler> processHandlers) {
        this.recordsService = recordsService;

        this.defaultProcessHandler = defaultProcessHandler;
        this.processHandlers = processHandlers.stream()
                                              .collect(toMap(IProcessHandler::getType, Function.identity()));
    }

    /**
     * Возвращает подготовленный обработчик.
     * <p>
     * Если обработчик для ресурса не найден вернется дефолтный который кидается BadRequestException.
     *
     * @return {@link IProcessHandler}
     */
    public IProcessHandler getHandler(ImportInitializingModel initializingModel) {
        ImportModelValidator.throwIfNotValid(initializingModel);

        ImportSource source = initializingModel.getSource();
        String libraryId = source.getLibraryId();
        Long objectId = source.getObjectId();
        ResourceQualifier tableQualifier = new ResourceQualifier(SYSTEM_SCHEMA_NAME, libraryId);

        Map<String, Object> recordData = recordsService.getById(tableQualifier, objectId);
        IRecord record = new RecordEntity(recordData);

        ProcessType processType = ProcessType.IMPORT;
        String fileType = record.getFileType();
        if (fileType.equals("gml")) {
            processType = ProcessType.IMPORT_GML;
        }

        if (fileType.equals("tif")) {
            processType = ProcessType.IMPORT_RASTER;
        }

        return processHandlers.getOrDefault(processType, defaultProcessHandler)
                              .setPayload(initializingModel, record)
                              .validate();
    }
}
