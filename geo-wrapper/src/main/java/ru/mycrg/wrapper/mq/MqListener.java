package ru.mycrg.wrapper.mq;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.common.*;
import ru.mycrg.common.config.MqProperties;
import ru.mycrg.common.enums.ProcessStatus;
import ru.mycrg.common.enums.RequestType;
import ru.mycrg.common.import_.ImportMqRequest;
import ru.mycrg.common.import_.ImportMqResponse;
import ru.mycrg.wrapper.dto.PostgreEvent;
import ru.mycrg.wrapper.service.geoserver.OrganizationService;
import ru.mycrg.wrapper.service.gml.GmlGenerator;
import ru.mycrg.wrapper.service.ImportService;
import ru.mycrg.wrapper.service.geoserver.AuthService;
import ru.mycrg.wrapper.service.validation.ValidationService;

import java.io.IOException;
import java.sql.SQLException;
import java.util.Map;

import static ru.mycrg.common.enums.EventType.CREATE_ORG;
import static ru.mycrg.common.enums.EventType.CREATE_PROJECT;

@Service
public class MqListener {

    private static final Logger log = LoggerFactory.getLogger(MqListener.class);

    private final IMqEvents mqEvents;
    private final OrganizationService organizationService;
    private final AuthService authService;
    private final ValidationService validationService;
    private final ImportService importService;
    private final GmlGenerator gmlGenerator;

    @Autowired
    public MqListener(IMqEvents mqEvents, OrganizationService organizationService, AuthService authService, GmlGenerator gmlGenerator,
                      ValidationService validationService, ImportService importService) {
        this.mqEvents = mqEvents;
        this.organizationService = organizationService;
        this.authService = authService;
        this.gmlGenerator = gmlGenerator;
        this.importService = importService;
        this.validationService = validationService;
    }

    @RabbitListener(queues = MqProperties.QUEUE_ORG_INIT)
    public void handleOrganizationEvent(final OrgMqRequest mqRequest) {
        log.info("handleOrganizationEvent. Получено сообщение {}", mqRequest.toString());

        switch (mqRequest.getType()) {
            case CREATE_ORG: createOrg(mqRequest); break;
            case CREATE_PROJECT: createProject(mqRequest); break;
            default:
                log.warn("Not processable event type");
        }
    }

    @RabbitListener(queues = MqProperties.QUEUE_IMPORT_INIT)
    public void initImport(ImportMqRequest request) {
        log.debug("Получено сообщение initImport");
        try {
            importService.doImport(request);

            mqEvents.importResponse(
                    new ImportMqResponse(
                            request.getId(),
                            request.getSourceResource().getTableName(),
                            ProcessStatus.DONE));
        } catch (Exception e) {
            log.error("Ошибка при импорте: {}", e.getLocalizedMessage());

            mqEvents.importResponse(
                    new ImportMqResponse(
                            request.getId(),
                            request.getSourceResource().getTableName(),
                            ProcessStatus.ERROR));
        }
    }

    @RabbitListener(queues = MqProperties.QUEUE_VALIDATION_START)
    public void validation(final ValidationMqRequest mqRequest) {
        log.info("Получено сообщение, Validation process: {} - {}", mqRequest.getId(), mqRequest.getType());

        try {
            if (mqRequest.getType() == RequestType.INIT) {
                validationService.startValidation(mqRequest);
            } else if (mqRequest.getType() == RequestType.GET) {
                mqEvents.validationResponse(validationService.getResults(mqRequest));
            } else if (mqRequest.getType() == RequestType.INFO) {
                mqEvents.validationResponse(validationService.getInfo(mqRequest));
            } else {
                log.warn("Not supported type");
            }
        } catch (Exception e) {
            log.error("Не удалось провалидировать", e);
            mqEvents.validationResponse(new ValidationMqResponse(mqRequest, ProcessStatus.ERROR));
        }
    }

    @RabbitListener(queues = MqProperties.QUEUE_GML_INIT)
    public void gmlInit(GmlMqRequest request) {
        log.info("Получено сообщение, gmlInit: {}", request.getId());

        try {
            Map<String, String> paths = gmlGenerator.generate(request);

            mqEvents.gmlResponse(new GmlMqResponse(request, paths, ProcessStatus.DONE, 100));
        } catch (Exception e) {
            log.error("Ошибка при генерирации файла.", e);
            mqEvents.gmlResponse(
                    new GmlMqResponse(request, ProcessStatus.ERROR, e.getLocalizedMessage(), 100));
        }
    }

    @RabbitListener(queues = MqProperties.QUEUE_POSTGRE_VALIDATION)
    public void postgreMsg(char[] any) {
        StringBuilder result = new StringBuilder();
        for (char c : any) {
            result.append(c);
        }

        ObjectMapper mapper = new ObjectMapper();
        try {
            PostgreEvent postgreEvent = mapper.readValue(result.toString(), PostgreEvent.class);

            log.info("Получено сообщение, from postgresql: {}", postgreEvent.getObjectid());
        } catch (IOException e) {
            log.error("Не удалось распарсить сообщение: {}", result);
        }
    }

    private void createProject(OrgMqRequest dto) {
        try {
            if (authService.authorize().isPresent()) {
                log.debug("Try create project: {}", dto.getProjectName());

                organizationService.createProject(dto);

                mqEvents.orgEventResponse(new OrgMqResponse(dto.getOrgId(), CREATE_PROJECT, ProcessStatus.DONE));
            }
        } catch (IOException | RuntimeException | SQLException e) {
            log.error("Неудалось создать проект: ", e);
            mqEvents.orgEventResponse(new OrgMqResponse(dto.getOrgId(), CREATE_PROJECT, ProcessStatus.ERROR));
        }
    }

    private void createOrg(OrgMqRequest dto) {
        try {
            if (authService.authorize().isPresent()) {
                try {
                    organizationService.createOrganization(dto);

                    mqEvents.orgEventResponse(new OrgMqResponse(dto.getOrgId(), CREATE_ORG, ProcessStatus.DONE));
                } catch (IOException | RuntimeException e) {
                    log.error("Неудалось создать организацию на геосервере: ", e);
                    mqEvents.orgEventResponse(new OrgMqResponse(dto.getOrgId(), CREATE_ORG, ProcessStatus.ERROR));
                }
            }
        } catch (IOException e) {
            log.error("Неудалось создать организацию на геосервере: ", e);
        }
    }

}
