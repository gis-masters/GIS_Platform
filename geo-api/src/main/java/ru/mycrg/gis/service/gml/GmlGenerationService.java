package ru.mycrg.gis.service.gml;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.GmlMqRequest;
import ru.mycrg.common.GmlMqResponse;
import ru.mycrg.common.ResourceProjection;
import ru.mycrg.gis.dto.GmlRequestDto;
import ru.mycrg.gis.dto.WsMessageDto;
import ru.mycrg.gis.queue.MqSender;
import ru.mycrg.gis.service.BaseProcessService;
import ru.mycrg.gis.service.CrgProcess;
import ru.mycrg.gis.service.WsNotificationService;
import ru.mycrg.gis.service.fgistp.EntityType;
import ru.mycrg.gis.service.fgistp.MapperUtil;
import ru.mycrg.gis.service.fgistp.rules.FgistpRuleService;

import java.util.Optional;
import java.util.concurrent.CompletableFuture;

import static ru.mycrg.gis.enums.ProcessType.EXPORT;

@Service
public class GmlGenerationService extends BaseProcessService {

    private static Logger log = LoggerFactory.getLogger(GmlGenerationService.class);

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
        processes.add(process);

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

    @Override
    public void handleMqResponse(BaseMqProcessResponse response) {
        if (response.getId() == null) {
            log.warn("Return invalid response");
        }

        Optional<CrgProcess> processById = getProcessById(response.getId());
        if (processById.isPresent()) {
            GmlProcess gmlProcess = (GmlProcess) processById.get();
            wsNotificationService.send(new WsMessageDto<>(EXPORT, response), gmlProcess.getRequest().getId());

            gmlProcess.handleMqResponse(response);
        } else {
            log.warn("Not found gml process by id: {}", response.getId());
        }
    }

}
