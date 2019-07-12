package ru.mycrg.gis.service.gml;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.GmlMqProcessRequest;
import ru.mycrg.common.GmlMqResponse;
import ru.mycrg.common.ResourceProjection;
import ru.mycrg.common.enums.ProcessType;
import ru.mycrg.gis.dto.GmlRequestDto;
import ru.mycrg.gis.dto.WsMessageDto;
import ru.mycrg.gis.entity.Process;
import ru.mycrg.gis.queue.MqSender;
import ru.mycrg.gis.repository.ProcessRepository;
import ru.mycrg.gis.service.BaseProcessService;
import ru.mycrg.gis.service.WsNotificationService;
import ru.mycrg.gis.service.fgistp.EntityType;
import ru.mycrg.gis.service.fgistp.MapperUtil;
import ru.mycrg.gis.service.fgistp.rules.FgistpRuleService;
import ru.mycrg.gis.service.DetailsModel;
import ru.mycrg.gis.service.SubProcessModel;

import java.io.IOException;
import java.security.Principal;

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
    public void handleMqResponse(BaseMqProcessResponse response) {
        GmlMqResponse mqResponse = (GmlMqResponse) response;

        if (mqResponse.getId() == null) {
            log.warn("Return invalid response");
        }

        Process process = getProcessById(mqResponse.getId());
        switch (mqResponse.getStatus()) {
            case PENDING:
            case SUB_ERROR:
            case SUB_DONE:  addSubStep(process, mqResponse);   break;
            case ERROR:     error(process);     break;
            case DONE:      complete(process);  break;
            default:
                log.warn("Not supported process status. {}", process);
        }

        String wsUiId = process.getExtra().get("wsUiId").toString();
        wsNotificationService.send(new WsMessageDto<>(mqResponse.getType(), mqResponse), wsUiId);
    }

    private void addSubStep(Process process, GmlMqResponse response) {
        process.setStatus(response.getStatus());

        try {
            String content = "{}";
            if (process.getDetails() != null) {
                content = process.getDetails().toString();
            }

            DetailsModel details = mapper.readValue(content, DetailsModel.class);

            SubProcessModel subProcess = new SubProcessModel(response.getLayerName(),
                    response.getDescription(), response.getError());

            details.addSubProcess(subProcess);

            JsonNode jsonNode = MapperUtil.convertToJsonNode(details);

            process.setDetails(jsonNode);
        } catch (IOException e) {
            log.error("Failed write details to process / Error: {}", e.getMessage());
        }

        log.debug("Add subStep to process: {}", process.getId());
    }

}
