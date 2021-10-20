package ru.mycrg.data_service.service.processes;

import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service_contract.enums.ProcessType;

public interface IProcessHandler {

    Process handle();

    IProcessHandler validate();

    ProcessType getType();

    IProcessHandler setPayload(Object data);
}
