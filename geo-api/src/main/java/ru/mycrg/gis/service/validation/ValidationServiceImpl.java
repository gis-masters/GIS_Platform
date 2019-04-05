package ru.mycrg.gis.service.validation;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.common.ValidationMqRequest;
import ru.mycrg.common.ValidationMqResponse;
import ru.mycrg.common.enums.RequestType;
import ru.mycrg.gis.dto.ValidationRequestDto;
import ru.mycrg.gis.dto.ValidationResponseDto;
import ru.mycrg.gis.queue.MqSender;
import ru.mycrg.gis.service.fgistp.EntityType;
import ru.mycrg.gis.service.fgistp.MapperUtil;
import ru.mycrg.gis.service.fgistp.rules.FgistpRuleService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Service
public class ValidationServiceImpl implements IValidationService {

    private static Logger log = LoggerFactory.getLogger(ValidationServiceImpl.class);

    private final MqSender mqSender;
    private final FgistpRuleService ruleService;

    private List<ValidationProcess> processes = new ArrayList<>();

    @Autowired
    public ValidationServiceImpl(MqSender mqSender,
                                 FgistpRuleService ruleService) {
        this.mqSender = mqSender;
        this.ruleService = ruleService;
    }

    @Override
    public CompletableFuture<List<ValidationResponseDto>> initProcess(String userName,
                                                                      List<ValidationRequestDto> request,
                                                                      int page, int size,
                                                                      RequestType type) {
        if (ruleService.isCacheEmpty()) {
            ruleService.updateRules();
        }

        ValidationProcess process = new ValidationProcess();
        process.setUserName(userName);
        process.setRequestType(type);
        process.addRequest(request);

        processes.add(process);

        process.getRequests().forEach(requestDto -> {
            log.debug("Start process: {} Request type: {}", process.getId(), process.getRequestType());

            mqSender.sendValidationRequest(
                    prepareMqRequest(page, size, process.getRequestType(), process.getId(), requestDto));
        });

        return process.getFutureResponse();
    }

    @Override
    public void progress(ValidationMqResponse response) {
        if (response.getId() == null) {
            log.warn("Return invalid response");
        }

        // TODO: При валидации не комплитить ответ пустыми данными если при валидации не выявлено ошибок
        // дожидаться каких либо ошибок либо DONE статуса

        Optional<ValidationProcess> processById = getProcessById(response.getId());
        if (processById.isPresent()) {
            ValidationProcess process = processById.get();
            process.handleResponse(response);
        } else {
            log.warn("Not found validation process by id: {}", response.getId());
        }
    }

    @NotNull
    private ValidationMqRequest prepareMqRequest(int page, int size, RequestType type,
                                                 UUID processId, ValidationRequestDto requestDto) {
        EntityType entityType = ruleService.getRuleByName(requestDto.getTableName());
        // entityType.setTableName(requestDto.getTableName());

        return new ValidationMqRequest(
                processId, type, page, size,
                requestDto.getDbName(),
                requestDto.getSchemaName(),
                MapperUtil.mapEntityTypeToDto(entityType));
    }

    private Optional<ValidationProcess> getProcessById(UUID id) {
        return processes.stream()
                .filter(processInfo -> processInfo.getId().equals(id))
                .findFirst();

    }

}
