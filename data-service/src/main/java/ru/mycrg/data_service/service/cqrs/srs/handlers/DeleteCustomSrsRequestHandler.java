package ru.mycrg.data_service.service.cqrs.srs.handlers;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.common_contracts.generated.SpatialReferenceSystem;
import ru.mycrg.data_service.dao.SpatialReferenceSystemsDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.queue.RpcProducer;
import ru.mycrg.data_service.service.cqrs.srs.requests.DeleteCustomSrsRequest;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

import java.util.Optional;

import static ru.mycrg.data_service.service.cqrs.srs.handlers.AddCustomSrsRequestHandler.SRID_FROM;
import static ru.mycrg.data_service.service.cqrs.srs.handlers.AddCustomSrsRequestHandler.SRID_POOL_SIZE;

@Component
public class DeleteCustomSrsRequestHandler extends BaseSrsRequestHandler implements IRequestHandler<DeleteCustomSrsRequest, Voidy> {

    private final SpatialReferenceSystemsDao srsDao;

    public DeleteCustomSrsRequestHandler(SpatialReferenceSystemsDao srsDao,
                                         RpcProducer rpcProducer,
                                         IAuthenticationFacade authenticationFacade) {
        super(rpcProducer, authenticationFacade);
        this.srsDao = srsDao;
    }

    @Override
    @Transactional
    public Voidy handle(DeleteCustomSrsRequest request) {
        int authSrid = request.getAuthSrid();

        ensureUserSridAllowed(authSrid);
        ensureSridExist(authSrid);

        //сначала удалим в базе
        try {
            srsDao.removeSrs(authSrid);
        } catch (CrgDaoException e) {

            log.warn("Ошибка при удалении проекции из базы данных: {}", e.getMessage());
            throw new DataServiceException("Не удалось удалить проекцию");
        }

        //если всё хорошо будем удалять на геосервере
        SpatialReferenceSystem srsToDelete = new SpatialReferenceSystem();
        srsToDelete.setAuthSrid(authSrid);

        log.debug("Значение перезагрузки геосервера: {}", request.getIsNeedToReloadGeoserver());

        Optional<?> result = sendGeoserverRequest(srsToDelete, "DELETE", "удалить",
                                                  request.getIsNeedToReloadGeoserver());
        if (result.isEmpty()) {
            log.info("Не удалось удалить проекцию: [{}] на геосервер", authSrid);

            throw new DataServiceException("Не удалось удалить проекцию");
        }

        return new Voidy();
    }

    public void ensureSridExist(int authSrid) {
        if (!srsDao.exists(authSrid)) {
            throw new BadRequestException(String.format("Проекции %d не существует.", authSrid));
        }
    }

    public void ensureUserSridAllowed(int authSrid) {
        int endOfRange =
                SRID_FROM + Math.toIntExact(SRID_FROM + (SRID_POOL_SIZE * authenticationFacade.getOrganizationId()));

        if (authSrid < SRID_FROM || authSrid > endOfRange) {
            throw new BadRequestException(String.format(
                    "Запрещено менять системные проекции. SRID %d — не пользовательский (допустимый диапазон %d…%d).",
                    authSrid, SRID_FROM, endOfRange));
        }
    }
}
