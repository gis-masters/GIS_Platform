package ru.mycrg.gis.service.gml;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.GmlMqRequest;
import ru.mycrg.common.GmlMqResponse;
import ru.mycrg.common.ResourceProjection;
import ru.mycrg.gis.dto.GmlRequestDto;
import ru.mycrg.gis.dto.WsMessageDto;
import ru.mycrg.gis.queue.MqSender;
import ru.mycrg.gis.service.WsNotificationService;
import ru.mycrg.gis.service.fgistp.EntityType;
import ru.mycrg.gis.service.fgistp.MapperUtil;
import ru.mycrg.gis.service.fgistp.rules.FgistpRuleService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

import static ru.mycrg.gis.enums.ProcessType.EXPORT;

@Service
public class GmlGenerationService {

    private static Logger log = LoggerFactory.getLogger(GmlGenerationService.class);

    private List<GmlProcess> gmlProcesses = new ArrayList<>();

    private final MqSender mqSender;
    private final FgistpRuleService ruleService;
    private final WsNotificationService wsNotificationService;

    public GmlGenerationService(MqSender mqSender,
                                FgistpRuleService ruleService,
                                WsNotificationService wsNotificationService) {
        this.mqSender = mqSender;
        this.ruleService = ruleService;
        this.wsNotificationService = wsNotificationService;
    }

    public CompletableFuture<GmlMqResponse> initProcess(GmlRequestDto request) {
        GmlProcess process = new GmlProcess(request);
        gmlProcesses.add(process);

        GmlMqRequest mqRequest = new GmlMqRequest(process.getId());
        mqRequest.setDocSchema(request.getDocSchema());

        request.getResources().forEach(resource -> {
            EntityType ruleByClassName = ruleService.getRuleByName(resource.getTableName());
            mqRequest.addRule(MapperUtil.mapEntityTypeToDto(ruleByClassName));
            mqRequest.addResource(
                    new ResourceProjection(resource.getDbName(), resource.getSchemaName(), resource.getTableName()));
        });

        mqSender.sendGmlInit(mqRequest);

        return process.getFutureResponse();
    }

    public void progress(GmlMqResponse response) {
        if (response.getId() == null) {
            log.warn("Return invalid response");
        }

        Optional<GmlProcess> processById = getProcessById(response.getId());
        if (processById.isPresent()) {
            GmlProcess gmlProcess = processById.get();
            wsNotificationService.send(new WsMessageDto<>(EXPORT, response),gmlProcess.getRequest().getId());

            gmlProcess.addResponse(response);
        } else {
            log.warn("Not found gml process by id: {}", response.getId());
        }
    }

    private Optional<GmlProcess> getProcessById(UUID id) {
        return gmlProcesses.stream()
                .filter(importProcess -> importProcess.getId().equals(id))
                .findFirst();
    }

}
