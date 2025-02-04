package ru.mycrg.data_service.service.processes.fts;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dto.ProcessDto;
import ru.mycrg.data_service.service.processes.IExecutor;
import ru.mycrg.data_service.service.processes.IProcessExecutorsFactory;
import ru.mycrg.data_service_contract.enums.ProcessType;

import static ru.mycrg.data_service_contract.enums.ProcessType.FULL_TEXT_SEARCH;

@Component
public class FtsProcessExecutorFactory implements IProcessExecutorsFactory {

    private final FtsExecutor executor;

    FtsProcessExecutorFactory(FtsExecutor executor) {
        this.executor = executor;
    }

    @Override
    public IExecutor<?> getExecutor(ProcessDto payload) {
        return executor;
    }

    @Override
    public ProcessType getType() {
        return FULL_TEXT_SEARCH;
    }
}
