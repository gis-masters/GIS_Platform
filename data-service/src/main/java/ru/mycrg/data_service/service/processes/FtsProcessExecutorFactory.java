package ru.mycrg.data_service.service.processes;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service_contract.enums.ProcessType;

@Component
public class FtsProcessExecutorFactory implements IProcessExecutorsFactory {

    private final FtsExecutor executor;

    FtsProcessExecutorFactory(FtsExecutor executor) {
        this.executor = executor;
    }

    @Override
    public IExecutor<?> getExecutor(ProcessDto model) {
        return executor;
    }

    @Override
    public ProcessType getType() {
        return ProcessType.FULL_TEXT_SEARCH;
    }
}
