package ru.mycrg.wrapper.queue;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.BaseMqProcessRequest;
import ru.mycrg.wrapper.service.SomeService;

@Service
public class EventDispatcherImpl implements IEventDispatcher {

    private static final Logger log = LoggerFactory.getLogger(MqListener.class);

    private final SomeService someService;

    public EventDispatcherImpl(SomeService someService) {
        this.someService = someService;
    }

    @Override
    public void handleEvent(BaseMqProcessRequest mqRequest) {

        switch (mqRequest.getType()) {
            case CREATE_ORG:        someService.createOrganization(mqRequest);  break;
            case CREATE_PROJECT:    someService.createProject(mqRequest);       break;
            default:
                log.warn("Unsupported mqRequest type: {}", mqRequest.getType());
        }
    }


//    @RabbitListener(queues = MqProperties.QUEUE_ORG_INIT)
//    public void handleOrganizationEvent(final OrgMqProcessRequest mqRequest) {
//        log.info("handleOrganizationEvent. Получено сообщение {}", mqRequest.toString());
//
//        switch (mqRequest.getType()) {
//            case CREATE_ORG: createOrg(mqRequest); break;
//            case CREATE_PROJECT: createProject(mqRequest); break;
//            case DELETE_PROJECT: deleteProject(mqRequest); break;
//            default:
//                log.warn("Not processable event type");
//        }
//    }

//    @RabbitListener(queues = MqProperties.QUEUE_IMPORT_INIT)
//    public void initImport(ImportMqRequest request) {
//        log.debug("Получено сообщение initImport");
//        try {
//            importService.doImport(request);
//        } catch (Exception e) {
//            log.error("Ошибка при импорте: {}", e.getMessage());
//            mqEvents.send("", "",
//                    new ImportMqResponse(request, ProcessStatus.ERROR, "Ошибка при импорте", e.getMessage()));
//        }
//    }

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

//    private void createProject(OrgMqProcessRequest request) {
//        try {
//            if (authService.authorize().isPresent()) {
//                log.debug("Request create project: {}", request.getProjectName());
//
//                projectService.createProject(request);
//
//                mqEvents.orgEventResponse(new OrgMqResponse(request, ProcessStatus.DONE));
//            }
//        } catch (IOException | RuntimeException | SQLException e) {
//            log.error("Не удалось создать проект: ", e);
//            mqEvents.orgEventResponse(new OrgMqResponse(request, ProcessStatus.ERROR));
//        }
//    }
//
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

//    private void createOrg(BaseMqProcessRequest mqRequest) {
//        OrgMqProcessRequest request = (OrgMqProcessRequest) mqRequest.getPayload();
//
//        try {
//            if (authService.authorize().isPresent()) {
//                try {
//                    organizationService.createOrganization(request);
//
//                    mqEvents.orgEventResponse(new OrgMqResponse(request, ProcessStatus.DONE));
//                } catch (IOException | RuntimeException e) {
//                    // TODO: Здесь мы должны понимать что именно не удалось выполнить не геосервере и принять меры.
//
//                    log.error("Не удалось создать организацию на геосервере: ", e);
//                    mqEvents.orgEventResponse(new OrgMqResponse(request, ProcessStatus.ERROR));
//                }
//            }
//        } catch (IOException e) {
//            log.error("-- Не удалось создать организацию на геосервере: ", e);
//
//            mqEvents.orgEventResponse(new OrgMqResponse(request, ProcessStatus.ERROR));
//        }
//    }


}
