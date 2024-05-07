package ru.mycrg.data_service.service.cqrs.srs.handlers;

import mil.nga.crs.util.proj.ProjParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageBuilder;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.stereotype.Component;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.common_contracts.generated.SpatialReferenceSystem;
import ru.mycrg.data_service.dao.SpatialReferenceSystemsDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ConflictException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.ErrorInfo;
import ru.mycrg.data_service.queue.RpcProducer;
import ru.mycrg.data_service.service.cqrs.srs.requests.AddCustomSrsRequest;
import ru.mycrg.mediator.IRequestHandler;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static ru.mycrg.data_service.config.CrgCommonConfig.DEFAULT_CONTENT_TYPE;
import static ru.mycrg.data_service.util.DetailedLogger.logError;
import static ru.mycrg.data_service.util.JsonConverter.asJsonString;

@Component
public class AddCustomSrsRequestHandler implements IRequestHandler<AddCustomSrsRequest, SpatialReferenceSystem> {

    private final Logger log = LoggerFactory.getLogger(AddCustomSrsRequestHandler.class);

    private static final int SRID_FROM = 200_000;
    private static final int SRID_POOL_SIZE = 2_000;

    private final RpcProducer rpcProducer;
    private final SpatialReferenceSystemsDao srsDao;
    private final IAuthenticationFacade authenticationFacade;

    public AddCustomSrsRequestHandler(SpatialReferenceSystemsDao srsDao,
                                      RpcProducer rpcProducer,
                                      IAuthenticationFacade authenticationFacade) {
        this.srsDao = srsDao;
        this.rpcProducer = rpcProducer;
        this.authenticationFacade = authenticationFacade;
    }

    @Override
    public SpatialReferenceSystem handle(AddCustomSrsRequest request) {
        SpatialReferenceSystem newSrs = request.getSrs();

        addToPostgisAndValidate(newSrs);

        Optional<?> result = addToGeoserver(newSrs);
        if (result.isEmpty()) {
            log.info("Не удалось добавить проекцию: [{}] на геосервер, выполняем откат", newSrs);

            try {
                srsDao.removeSrs(newSrs.getAuthSrid());
            } catch (CrgDaoException e) {
                log.error("Не удалось удалить проекцию: [{}] => {}", newSrs, e.getMessage());
            }

            throw new DataServiceException("Не удалось добавить проекцию");
        }

        return newSrs;
    }

    private Optional<?> addToGeoserver(SpatialReferenceSystem newSrs) {
        String requestCorrelationId = UUID.randomUUID().toString();
        Message message = MessageBuilder.withBody(asJsonString(newSrs).getBytes())
                                        .setCorrelationId(requestCorrelationId)
                                        .setHeader("token", authenticationFacade.getAccessToken())
                                        .setContentType(DEFAULT_CONTENT_TYPE)
                                        .build();

        Message response = rpcProducer.produce(message);
        if (response == null) {
            log.error("Не дождались ответа от gis-service/geoserver. correlationId: {}", requestCorrelationId);

            return Optional.empty();
        }

        log.debug("correlationId: {}", requestCorrelationId);
        MessageProperties messageProperties = response.getMessageProperties();
        String responseCorrelationId = messageProperties.getCorrelationId();

        if (responseCorrelationId.equals(requestCorrelationId)) {
            String responseAsString = new String(response.getBody());

            if ("SUCCESS".equals(responseAsString)) {
                log.debug("Проекция: [{}] успешно добавлена на геосервер", newSrs);

                return Optional.of(Boolean.TRUE);
            }
        } else {
            log.debug("Не совпал correlationId - не наше сообщение");
        }

        return Optional.empty();
    }

    public void addToPostgisAndValidate(SpatialReferenceSystem newSrs) {
        // Присваиваем идентификатор
        Integer requestedAuthSrid = newSrs.getAuthSrid();
        if (requestedAuthSrid != null) {
            if (srsDao.exists(newSrs.getAuthSrid())) {
                throw new ConflictException("Уже существует проекция: " + newSrs.getAuthSrid());
            }
        } else {
            int sridFrom = Math.toIntExact(SRID_FROM + (SRID_POOL_SIZE * authenticationFacade.getOrganizationId()));
            Integer srid = srsDao.getNextSrid(sridFrom, sridFrom + SRID_POOL_SIZE)
                                 .orElseThrow(() -> new DataServiceException(
                                         "Не удалось найти свободный идентификатор в таблице spatial_ref_sys"));
            newSrs.setAuthSrid(srid);
        }

        // Проверяем проекцию и выводим из wkt proj4 строку.
        try {
            newSrs.setProj4Text(ProjParser.paramsText(newSrs.getSrtext()));
        } catch (Exception e) {
            logError("Проекция не прошла проверку", e);
            List<ErrorInfo> errors = List.of(new ErrorInfo("srtext", e.getMessage()));

            throw new BadRequestException("Задана не корректная проекция", errors);
        }

        // Сохраняем проекцию
        try {
            srsDao.addSrs(newSrs);
        } catch (Exception e) {
            throw new DataServiceException("Не удалось добавить проекцию => " + e.getMessage());
        }
    }
}
