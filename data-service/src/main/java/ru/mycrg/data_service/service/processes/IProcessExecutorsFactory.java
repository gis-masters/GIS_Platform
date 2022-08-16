package ru.mycrg.data_service.service.processes;

import ru.mycrg.data_service_contract.enums.ProcessType;

public interface IProcessExecutorsFactory {

    IExecutor<?> getExecutor(Object payload);

    ProcessType getType();
}
