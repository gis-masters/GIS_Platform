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
import ru.mycrg.gis.repository.ProcessRepository;
import ru.mycrg.gis.service.BaseProcessService;
import ru.mycrg.gis.service.WsNotificationService;
import ru.mycrg.gis.service.fgistp.EntityType;
import ru.mycrg.gis.service.fgistp.MapperUtil;
import ru.mycrg.gis.service.fgistp.rules.FgistpRuleService;

import java.security.Principal;
import java.util.Optional;

@Service
public class GmlGenerationService extends BaseProcessService {

    private static Logger log = LoggerFactory.getLogger(GmlGenerationService.class);

    private final MqSender mqSender;
    private final FgistpRuleService ruleService;
    private final WsNotificationService wsNotificationService;

    public GmlGenerationService(MqSender mqSender,
                                FgistpRuleService ruleService,
                                ProcessRepository processRepository,
                                WsNotificationService wsNotificationService) {
        super(processRepository);

        this.mqSender = mqSender;
        this.ruleService = ruleService;
        this.wsNotificationService = wsNotificationService;
    }

    public Process initProcess(GmlRequestDto request, Principal principal) {
        Process process = create(principal.getName(),"Выгрузка GML", ProcessType.GML_EXPORT, request);

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
    public void handleMqResponse(BaseMqProcessResponse mqResponse) {
        if (mqResponse.getId() == null) {
            log.warn("Return invalid response");
        }

        Process process = getProcessById(mqResponse.getId());
        handleProcessResponse(process, mqResponse);

//            wsNotificationService.send(new WsMessageDto<>(response.getType(), response), process.getRequest().getWsUiId());
    }

}
