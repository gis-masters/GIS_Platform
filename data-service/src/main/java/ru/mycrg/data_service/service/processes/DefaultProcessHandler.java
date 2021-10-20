package ru.mycrg.data_service.service.processes;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service_contract.enums.ProcessType;

@Component
public class DefaultProcessHandler implements IProcessHandler {

    @Override
    public Process handle() {
        throw new BadRequestException("No handlers found for handle data");
    }

    @Override
    public IProcessHandler validate() {
        return this;
    }

    @Override
    public IProcessHandler setPayload(Object data) {
        return null;
    }

    @Override
    public ProcessType getType() {
        return null;
    }
}
