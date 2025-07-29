package ru.mycrg.data_service.service.cqrs.srs.handlers;

import mil.nga.crs.util.proj.ProjParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageBuilder;
import org.springframework.amqp.core.MessageProperties;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.common_contracts.generated.SpatialReferenceSystem;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ErrorInfo;
import ru.mycrg.data_service.queue.RpcProducer;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static ru.mycrg.data_service.config.CrgCommonConfig.DEFAULT_CONTENT_TYPE;
import static ru.mycrg.data_service.util.DetailedLogger.logError;
import static ru.mycrg.data_service.util.JsonConverter.asJsonString;

public abstract class BaseSrsRequestHandler {

    protected final Logger log = LoggerFactory.getLogger(getClass());

    protected final RpcProducer rpcProducer;
    protected final IAuthenticationFacade authenticationFacade;

    public final String DELETE = "DELETE";
    public final String SUCCESS = "SUCCESS";

    protected BaseSrsRequestHandler(RpcProducer rpcProducer, IAuthenticationFacade authenticationFacade) {
        this.rpcProducer = rpcProducer;
        this.authenticationFacade = authenticationFacade;
    }

    protected Optional<?> sendGeoserverRequest(SpatialReferenceSystem srs,
                                               String operation,
                                               String operationDescription,
                                               boolean isNeedToReloadGeoserver) {
        String requestCorrelationId = UUID.randomUUID().toString();

        MessageBuilder messageBuilder = (MessageBuilder) MessageBuilder.withBody(asJsonString(srs).getBytes())
                                                                       .setCorrelationId(requestCorrelationId)
                                                                       .setHeader("token",
                                                                                  authenticationFacade.getAccessToken())
                                                                       .setContentType(DEFAULT_CONTENT_TYPE);

        if (DELETE.equals(operation)) {
            messageBuilder.setHeader("operation", DELETE);
            messageBuilder.setHeader("isNeedToReloadGeoserver", isNeedToReloadGeoserver);
        }

        Message message = messageBuilder.build();
        Message response = rpcProducer.produce(message);

        if (response == null) {
            log.error("Не дождались ответа от gis-service/geoserver при операции {}. correlationId: {}",
                      operationDescription, requestCorrelationId);
            return Optional.empty();
        }

        log.debug("correlationId: {}", requestCorrelationId);
        MessageProperties messageProperties = response.getMessageProperties();
        String responseCorrelationId = messageProperties.getCorrelationId();

        if (responseCorrelationId.equals(requestCorrelationId)) {
            String responseAsString = new String(response.getBody());
            if (SUCCESS.equals(responseAsString)) {
                log.debug("Проекция: [{}] успешно {} на геосервер",
                          DELETE.equals(operation) ? srs.getAuthSrid() : srs,
                          operationDescription);
                return Optional.of(Boolean.TRUE);
            } else {
                log.error("Geoserver {} response body: [{}]", operationDescription, responseAsString);
            }
        } else {
            log.debug("Не совпал correlationId - не наше сообщение");
        }

        return Optional.empty();
    }

    protected void validateProjectionAndSetProj4(SpatialReferenceSystem srs, String wkt) {
        try {
            srs.setProj4Text(ProjParser.paramsText(wkt));
        } catch (Exception e) {
            throw createProjectionValidationException(e);
        }
    }

    protected BadRequestException createProjectionValidationException(Exception e) {
        logError("Проекция не прошла проверку", e);
        List<ErrorInfo> errors = List.of(new ErrorInfo("srtext", e.getMessage()));

        return new BadRequestException("Задана не корректная проекция", errors);
    }
}
