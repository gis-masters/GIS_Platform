package ru.mycrg.data_service.service.processes;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.service.import_.model.PlacementPayloadModel;
import ru.mycrg.data_service_contract.enums.ProcessType;

import java.util.List;
import java.util.Map;
import java.util.function.Function;

import static java.util.stream.Collectors.toMap;
import static ru.mycrg.data_service.service.JsonConverter.mapper;
import static ru.mycrg.data_service_contract.enums.ProcessType.IMPORT;

@Component
public class PlacementProcessExecutorsFactory implements IProcessExecutorsFactory {

    private final Logger log = LoggerFactory.getLogger(PlacementProcessExecutorsFactory.class);

    private final Map<ProcessType, IExecutor<?>> executors;

    public PlacementProcessExecutorsFactory(List<IExecutor<?>> importExecutors) {
        this.executors = importExecutors.stream()
                                        .collect(toMap(IExecutor::getType, Function.identity()));
    }

    public IExecutor<?> getExecutor(Object data) {
        PlacementPayloadModel payloadModel;
        try {
            payloadModel = mapper.convertValue(data, PlacementPayloadModel.class);
        } catch (Exception e) {
            String msg = String.format("Задана некорректная модель для импорта: '%s'", data);
            log.error(msg, e.getCause());

            throw new BadRequestException(msg);
        }

        IExecutor<?> executor = executors.get(payloadModel.getType());
        if (executor == null) {
            throw new BadRequestException("Задан не поддерживаемый тип импорта: " + payloadModel.getType());
        }

        return executor.initialize(payloadModel.getPayload())
                       .validate();
    }

    @Override
    public ProcessType getType() {
        return IMPORT;
    }
}
