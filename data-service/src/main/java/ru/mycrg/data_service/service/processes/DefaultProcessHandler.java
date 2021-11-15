package ru.mycrg.data_service.service.processes;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.entity.IRecord;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.service.processes.dto.ImportInitializingModel;
import ru.mycrg.data_service_contract.enums.ProcessType;

@Component
public class DefaultProcessHandler implements IProcessHandler {

    @Override
    public Process handle() {
        throw new BadRequestException("No handlers found for this object");
    }

    @Override
    public IProcessHandler validate() {
        return this;
    }

    @Override
    public IProcessHandler setPayload(ImportInitializingModel importInitialData, IRecord record) {
        return this;
    }

    @Override
    public ProcessType getType() {
        return null;
    }
}
