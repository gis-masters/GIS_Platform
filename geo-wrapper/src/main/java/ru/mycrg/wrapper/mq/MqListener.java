package ru.mycrg.wrapper.mq;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.common.ResourceProjection;
import ru.mycrg.common.ValidationMqRequest;
import ru.mycrg.common.ValidationMqResponse;
import ru.mycrg.common.config.MqProperties;
import ru.mycrg.common.enums.RequstType;
import ru.mycrg.common.enums.ProcessStatus;
import ru.mycrg.common.import_.ImportMqRequest;
import ru.mycrg.common.import_.ImportMqResponse;
import ru.mycrg.wrapper.dto.MqOrganizationInit;
import ru.mycrg.wrapper.dto.PostgreEvent;
import ru.mycrg.wrapper.service.GmlGenerator;
import ru.mycrg.wrapper.service.ImportService;
import ru.mycrg.wrapper.service.geoserver.AuthService;
import ru.mycrg.wrapper.service.geoserver.IGeoServer;
import ru.mycrg.wrapper.service.validation.ValidationService;

import java.io.IOException;
import java.util.List;

@Service
public class MqListener {

    private static final Logger log = LoggerFactory.getLogger(MqListener.class);

    private final IMqEvents mqEvents;
    private final IGeoServer geoServer;
    private final AuthService authService;
    private final ValidationService validationService;
    private final ImportService importService;
    private final GmlGenerator gmlGenerator;

    @Autowired
    public MqListener(IMqEvents mqEvents, IGeoServer geoServer, AuthService authService, GmlGenerator gmlGenerator,
                      ValidationService validationService, ImportService importService) {
        this.mqEvents = mqEvents;
        this.geoServer = geoServer;
        this.authService = authService;
        this.gmlGenerator = gmlGenerator;
        this.importService = importService;
        this.validationService = validationService;
    }

    @RabbitListener(queues = MqProperties.QUEUE_ORG_INIT)
    public void initOrganization(final MqOrganizationInit creationDto) {
        log.info("initCreation. Получено сообщение {}", creationDto.toString());

        try {
            if (authService.authorize().isPresent()) {
                try {
                    geoServer.createOrganization(creationDto.getId(), creationDto.getRawPassword());

                    mqEvents.created(creationDto.getId());
                } catch (IOException | RuntimeException e) {
                    log.error("Неудалось создать организацию на геосервере: ", e);
                }
            }
        } catch (IOException e) {
            log.error("Неудалось создать организацию на геосервере: ", e);
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
            if (mqRequest.getType() == RequstType.INIT) {
                validationService.startValidation(mqRequest);
            } else if (mqRequest.getType() == RequstType.GET) {
                validationService.getResults(mqRequest);
            } else if (mqRequest.getType() == RequstType.INFO) {
                validationService.getInfo(mqRequest);
            } else {
                log.warn("Not supported type");
            }
        } catch (Exception e) {
            log.error("Не удалось провалидировать.", e);
            mqEvents.validationResponse(new ValidationMqResponse(mqRequest, ProcessStatus.ERROR));
        }
    }

    @RabbitListener(queues = MqProperties.QUEUE_GML_INIT)
    public void gmlInit(List<ResourceProjection> request) {
        log.info("Получено сообщение, gmlInit");

        try {
            gmlGenerator.generate(request.get(0));
        } catch (Exception e) {
            log.error("Не удалось провалидировать.", e);
            // mqEvents.validationResponse(new ValidationMqResponse(mqRequest, ProcessStatus.ERROR));
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

}
