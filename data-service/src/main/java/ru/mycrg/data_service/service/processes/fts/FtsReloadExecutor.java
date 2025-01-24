package ru.mycrg.data_service.service.processes.fts;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.service.cqrs.fts.requests.FtsReloadRequest;
import ru.mycrg.data_service.service.import_.model.FilePlacementPayloadModel;
import ru.mycrg.data_service.service.processes.IExecutor;
import ru.mycrg.data_service_contract.dto.ProcessModel;
import ru.mycrg.mediator.Mediator;

@Component
public class FtsReloadExecutor  implements IExecutor<String> {

    private String result;
    private final Mediator mediator;

    FtsReloadExecutor(Mediator mediator) {
        this.mediator = mediator;
    }

    @Override
    public String execute() {
        result = mediator.execute(new FtsReloadRequest());

        return result;
    }

    @Override
    public IExecutor<String> initialize(Object payload) {
        return this;
    }

    @Override
    public IExecutor<String> validate() {
        // Valid
        return this;
    }

    @Override
    public String getReport() {
        return result;
    }

    @Override
    public IExecutor<String> setPayload(ProcessModel processModel) {
        return this;
    }

    @Override
    public FilePlacementPayloadModel getPayload() {
        return null;
    }
}
