package ru.mycrg.gis.service.gml;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.GmlMqProcessRequest;
import ru.mycrg.common.ResourceProjection;
import ru.mycrg.common.enums.ProcessType;
import ru.mycrg.gis.dto.GmlRequestDto;
import ru.mycrg.gis.entity.Process;
import ru.mycrg.gis.queue.MqSender;
import ru.mycrg.gis.service.ProcessService;
import ru.mycrg.gis.service.Processable;
import ru.mycrg.gis.service.WsNotificationService;
import ru.mycrg.gis.service.fgistp.EntityType;
import ru.mycrg.gis.service.fgistp.MapperUtil;
import ru.mycrg.gis.service.fgistp.rules.FgistpRuleService;

import java.security.Principal;
import java.util.Optional;

@Service
public class GmlGenerationService implements Processable {

    private static Logger log = LoggerFactory.getLogger(GmlGenerationService.class);

    private final MqSender mqSender;
    private final FgistpRuleService ruleService;
    private final ProcessService processService;
    private final WsNotificationService wsNotificationService;

    public GmlGenerationService(MqSender mqSender,
                                FgistpRuleService ruleService,
                                ProcessService processService,
                                WsNotificationService wsNotificationService) {
        this.mqSender = mqSender;
        this.ruleService = ruleService;
        this.processService = processService;
        this.wsNotificationService = wsNotificationService;
    }

    public Process initProcess(GmlRequestDto request, Principal principal) {
        Process process = processService.create(principal.getName(),"Выгрузка GML", ProcessType.GML_EXPORT, request);

        GmlMqProcessRequest mqRequest = new GmlMqProcessRequest(process.getId());
        mqRequest.setDocSchema(request.getDocSchema());

        request.getResources().forEach(resource -> {
            EntityType ruleByClassName = ruleService.getRuleByName(resource.getTableName());
            mqRequest.addRule(MapperUtil.mapEntityTypeToDto(ruleByClassName));
            mqRequest.addResource(
                    new ResourceProjection(resource.getDbName(), resource.getSchemaName(), resource.getTableName()));
        });

        mqSender.sendGmlInit(mqRequest);

        return process;
    }

    @Override
    public void handleMqResponse(BaseMqProcessResponse response) {
        if (response.getId() == null) {
            log.warn("Return invalid response");
        }

        Optional<Process> processById = processService.getProcessById(response.getId());
        if (processById.isPresent()) {
            Process process = processById.get();

//            wsNotificationService.send(new WsMessageDto<>(response.getType(), response), process.getRequest().getWsUiId());

            processService.complete(process);
        } else {
            log.warn("Not found gml process by id: {}", response.getId());
        }
    }

}
