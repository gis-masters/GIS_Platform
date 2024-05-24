package ru.mycrg.data_service.service.processes.fts;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import ru.mycrg.common_contracts.generated.fts.FtsRequestDto;
import ru.mycrg.common_contracts.generated.fts.FtsResponseDto;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ErrorInfo;
import ru.mycrg.data_service.service.cqrs.fts.requests.FtsRequest;
import ru.mycrg.data_service.service.import_.model.FilePlacementPayloadModel;
import ru.mycrg.data_service.service.processes.IExecutor;
import ru.mycrg.data_service_contract.dto.ProcessModel;
import ru.mycrg.mediator.Mediator;

import java.util.List;
import java.util.Map;

import static ru.mycrg.data_service.util.JsonConverter.mapper;

@Component
public class FtsExecutor implements IExecutor<Page<FtsResponseDto>> {

    private final Logger log = LoggerFactory.getLogger(FtsExecutor.class);

    private FtsRequestDto payload;
    private Pageable pageable;
    private Page<FtsResponseDto> result;

    private final Mediator mediator;

    public FtsExecutor(Mediator mediator) {
        this.mediator = mediator;
    }

    @Override
    public Page<FtsResponseDto> execute() {
        log.info("FTS executor started");
        result = mediator.execute(new FtsRequest(payload, pageable));

        return result;
    }

    @Override
    @SuppressWarnings("unchecked")
    public IExecutor<Page<FtsResponseDto>> initialize(Object payload) {

        try {
            this.payload = mapper.convertValue(payload, FtsRequestDto.class);
        } catch (Exception e) {
            String msg = String.format("Задана некорректная модель FTS поиска: %s", payload);
            log.error(msg, e.getCause());

            throw new BadRequestException(msg);
        }

        Map<String, Object> data = (Map<String, Object>) payload;
        if (data.containsKey("page") && data.containsKey("size")) {
            this.pageable = PageRequest.of((int) data.get("page"), (int) data.get("size"));
        } else {
            this.pageable = PageRequest.of(0, 20);
        }

        return this;
    }

    @Override
    public IExecutor<Page<FtsResponseDto>> validate() {
        if (payload.getText() == null || payload.getText().isBlank()) {
            throw new BadRequestException("Некорректный запрос",
                                          List.of(new ErrorInfo("text", "Поле обязательно к заполнению")));
        }

        return this;
    }

    @Override
    public Page<FtsResponseDto> getReport() {
        return result;
    }

    @Override
    public IExecutor<Page<FtsResponseDto>> setPayload(ProcessModel processModel) {
        return this;
    }

    @Override
    public FilePlacementPayloadModel getPayload() {
        return null;
    }
}
