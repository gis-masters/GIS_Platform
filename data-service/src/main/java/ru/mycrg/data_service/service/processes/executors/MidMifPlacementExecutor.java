package ru.mycrg.data_service.service.processes.executors;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.service.import_.model.FilePlacementPayloadModel;
import ru.mycrg.data_service.service.processes.IExecutor;
import ru.mycrg.data_service.service.processes.IFilePlacer;
import ru.mycrg.data_service_contract.dto.ImportReport;
import ru.mycrg.data_service_contract.dto.ProcessModel;
import ru.mycrg.data_service_contract.enums.FileType;
import ru.mycrg.data_service_contract.enums.ProcessType;

import static ru.mycrg.data_service_contract.enums.FileType.MID;
import static ru.mycrg.data_service_contract.enums.ProcessType.IMPORT;

@Component
public class MidMifPlacementExecutor implements IExecutor<ImportReport>, IFilePlacer {

    private final FilePlacementExecutor filePlacementExecutor;

    public MidMifPlacementExecutor(FilePlacementExecutor filePlacementExecutor) {
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
    public ProcessType getType() {
        return IMPORT;
    }

    @Override
    public FileType getFileType() {
        return MID;
    }

    @Override
    public boolean notDetached() {
        return false;
    }
}