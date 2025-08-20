package ru.mycrg.data_service.service.processes.fts;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dto.ProcessDto;
import ru.mycrg.data_service.service.processes.IExecutor;
import ru.mycrg.data_service.service.processes.IProcessExecutorsFactory;
import ru.mycrg.data_service_contract.enums.ProcessType;

import static ru.mycrg.data_service_contract.enums.ProcessType.FTS_RELOAD;

@Component
public class FtsReloadProcessExecutorFactory implements IProcessExecutorsFactory {

    private final FtsReloadExecutor executor;

    FtsReloadProcessExecutorFactory(FtsReloadExecutor executor) {
        this.executor = executor;
    }

    @Override
    public IExecutor<?> getExecutor(ProcessDto payload) {
        return executor;
    }

    @Override
    public ProcessType getType() {
        return FTS_RELOAD;
    }
}
