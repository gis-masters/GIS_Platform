package ru.mycrg.wrapper.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.BaseMqProcessRequest;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.OrgMqProcessRequest;
import ru.mycrg.common.enums.ProcessStatus;
import ru.mycrg.wrapper.dao.BaseDaoService;
import ru.mycrg.wrapper.geoserver_client.services.IProject;
import ru.mycrg.wrapper.queue.MqSender;
import ru.mycrg.wrapper.service.requests_handler.IRequestHandler;

import static ru.mycrg.common.CrgConstants.DEFAULT_DB_NAME;

/**
 * Сервис обрабатывающий события касательно проектов.
 */
@Service
public class CreateProjectRequestHandler extends BaseRequestHandler implements IRequestHandler {

    private final Logger log = LoggerFactory.getLogger(CreateProjectRequestHandler.class);

    private final IProject geoserverClient;
    private final BaseDaoService baseDaoService;
    private final MqSender mqSender;

    public CreateProjectRequestHandler(IProject geoserverClient,
                                       BaseDaoService baseDaoService,
                                       MqSender mqSender) {
        this.geoserverClient = geoserverClient;
        this.baseDaoService = baseDaoService;
        this.mqSender = mqSender;
    }

    @Override
    public void handle(BaseMqProcessRequest mqRequest) {
        try {
            OrgMqProcessRequest payload = mapper.convertValue(mqRequest.getPayload(), OrgMqProcessRequest.class);
            geoserverClient.createProject(payload.getProjectName(), payload.getOrgId());

            baseDaoService.initP10Template(DEFAULT_DB_NAME + payload.getOrgId(), payload.getProjectName());

            mqSender.send(new BaseMqProcessResponse(mqRequest, payload.getOrgId(), ProcessStatus.DONE));
        } catch (Exception e) {
            log.error("Не удалось создать организацию на геосервере: ", e);

            mqSender.send(new BaseMqProcessResponse(mqRequest, ProcessStatus.ERROR, e.getMessage()));
        }
    }

}

//    @RabbitListener(queues = MqProperties.QUEUE_VALIDATION_START)
//    public void validation(final ValidationMqProcessRequest mqRequest) {
//        log.info("Получено сообщение, Validation process: {} - {}", mqRequest.getId(), mqRequest.getType());
//
//        try {
//            if (mqRequest.getType() == ProcessType.VALIDATION_INIT) {
//                validationService.startValidation(mqRequest);
//            } else {
//                log.warn("Not supported type");
//            }
//        } catch (Exception e) {
//            log.error("Не удалось провалидировать", e);
//            ValidationMqResponse response = new ValidationMqResponse(mqRequest, ProcessStatus.ERROR);
//            response.setError(e.getMessage());
//            response.setDescription("Не удалось провалидировать");
//
//            mqEvents.validationResponse(response);
//        }
//    }

//    @RabbitListener(queues = MqProperties.QUEUE_GML_INIT)
//    public void gmlInit(MqExportProcessRequest request) {
//        log.info("Получено сообщение, gmlInit: {}", request.getId());
//
//        try {
//            String path;
//            if (request.getFormat() != null) {
//                path = gdalService.generate(request);
//
//                EntityTypeDto featureDescription = request.getFgistpRules().get(0);
//                MqExportResponse exportMqResponse = new MqExportResponse(request, path, ProcessStatus.DONE, 100);
//                exportMqResponse.setLayerName(featureDescription.getTitle());
//
//                mqEvents.gmlResponse(exportMqResponse);
//            } else {
//                path = gmlGenerator.generate(request);
//                mqEvents.gmlResponse(new MqExportResponse(request, path, ProcessStatus.DONE, 100));
//            }
//        } catch (Exception e) {
//            log.error("Ошибка при генерирации файла. {}", e.getMessage());
//            MqExportResponse gmlMqResponse = new MqExportResponse(request, ProcessStatus.ERROR, e.getLocalizedMessage(), 100, e.getMessage());
//
//            mqEvents.gmlResponse(gmlMqResponse);
//        }
//    }



//    private void deleteProject(OrgMqProcessRequest request) {
//        try {
//            if (authService.authorize().isPresent()) {
//                log.debug("Request delete project: {}", request.getProjectName());
//                log.debug("NOT IMPLEMENTED YET...");
//
//                // projectService.deleteProject(request);
//
//                mqEvents.orgEventResponse(new OrgMqResponse(request, ProcessStatus.DONE));
//            }
//        } catch (IOException | RuntimeException e) {
//            log.error("Не удалось создать проект: ", e);
//            mqEvents.orgEventResponse(new OrgMqResponse(request, ProcessStatus.ERROR));
//        }
//    }



//    @RabbitListener(queues = MqProperties.QUEUE_POSTGRE_VALIDATION)
//    public void postgreMsg(char[] any) {
//        StringBuilder result = new StringBuilder();
//        for (char c : any) {
//            result.append(c);
//        }
//
//        ObjectMapper mapper = new ObjectMapper();
//        try {
//            PostgreEvent postgreEvent = mapper.readValue(result.toString(), PostgreEvent.class);
//
//            log.info("Получено сообщение, from postgresql: {}", postgreEvent.getObjectid());
//        } catch (IOException e) {
//            log.error("Не удалось распарсить сообщение: {}", result);
//        }
//    }
