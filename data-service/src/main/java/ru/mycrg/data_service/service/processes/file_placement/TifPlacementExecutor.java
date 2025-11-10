package ru.mycrg.data_service.service.processes.file_placement;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.service.import_.model.FilePlacementPayloadModel;
import ru.mycrg.data_service.service.processes.IExecutor;
import ru.mycrg.data_service_contract.dto.ImportReport;
import ru.mycrg.data_service_contract.dto.ProcessModel;
import ru.mycrg.data_service_contract.enums.FileType;

import static ru.mycrg.data_service_contract.enums.FileType.TIF;

@Component
public class TifPlacementExecutor implements IExecutor<ImportReport>, IFilePlacer {

    private final FilePlacementExecutor filePlacementExecutor;
    private static final Logger log = LoggerFactory.getLogger(TifPlacementExecutor.class);

    public TifPlacementExecutor(FilePlacementExecutor filePlacementExecutor) {
        this.filePlacementExecutor = filePlacementExecutor;
    }

    @Override
    public ImportReport execute() {
        return filePlacementExecutor.execute();
    }

    @Override
    public ImportReport getReport() {
        return filePlacementExecutor.getReport();
    }

    @Override
    public IExecutor<ImportReport> setPayload(ProcessModel processModel) {
        filePlacementExecutor.setPayload(processModel);

        return this;
    }

    @Override
    public FilePlacementPayloadModel getPayload() {
        return filePlacementExecutor.getPayload();
    }

    @Override
    public IExecutor<ImportReport> initialize(Object data) {
        filePlacementExecutor.initialize(data);

        return this;
    }

    @Override
    public IExecutor<ImportReport> validate() {
        // Nothing to do

        return this;
    }

    @Override
    public FileType getFileType() {
        return TIF;
    }

    @Override
    public boolean notDetached() {
        return false;
    }

    @Override
    public void cleanup() {
        log.debug("Процесс завершился с ошибкой. Операция очистки запущена, но не существует.");
    }
}
