package ru.mycrg.gis.service.gml;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.GmlMqRequest;
import ru.mycrg.common.GmlMqResponse;
import ru.mycrg.common.ResourceProjection;
import ru.mycrg.gis.dto.GmlRequestDto;
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
public class GmlService {

    private static Logger log = LoggerFactory.getLogger(GmlService.class);

    private List<GmlProcess> gmlProcesses = new ArrayList<>();

    private final MqSender mqSender;
    private final FgistpRuleService ruleService;

    public GmlService(MqSender mqSender, FgistpRuleService ruleService) {
        this.mqSender = mqSender;
        this.ruleService = ruleService;
    }

    public CompletableFuture<GmlMqResponse> initProcess(GmlRequestDto request) {
        GmlProcess process = new GmlProcess(request);
        gmlProcesses.add(process);

        GmlMqRequest mqRequest = new GmlMqRequest(process.getId());
        mqRequest.setDocSchema(request.getDocSchema());

        request.getResources().forEach(resource -> {
            EntityType ruleByClassName = ruleService.getRuleByClassName(resource.getTableName());
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

        getProcessById(response.getId())
                .ifPresentOrElse(
                        process -> process.addResponse(response),
                        () -> log.warn("Not found gml process by id: {}", response.getId()));
    }

    private Optional<GmlProcess> getProcessById(UUID id) {
        return gmlProcesses.stream()
                .filter(importProcess -> importProcess.getId().equals(id))
                .findFirst();
    }

}
