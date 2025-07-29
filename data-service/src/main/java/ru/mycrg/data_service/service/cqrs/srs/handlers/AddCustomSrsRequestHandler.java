package ru.mycrg.data_service.service.cqrs.srs.handlers;

import org.apache.commons.lang3.StringUtils;
import org.geotools.referencing.CRS;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.common_contracts.generated.SpatialReferenceSystem;
import ru.mycrg.data_service.dao.SpatialReferenceSystemsDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ConflictException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.queue.RpcProducer;
import ru.mycrg.data_service.service.cqrs.srs.requests.AddCustomSrsRequest;
import ru.mycrg.mediator.IRequestHandler;

import java.util.Optional;

import static ru.mycrg.data_service.service.srs.SrsUtils.addAuthority;
import static ru.mycrg.data_service.service.srs.SrsUtils.replaceAuthority;

@Component
public class AddCustomSrsRequestHandler extends BaseSrsRequestHandler
        implements IRequestHandler<AddCustomSrsRequest, SpatialReferenceSystem>
{

    protected static final int SRID_FROM = 200_000;
    protected static final int SRID_POOL_SIZE = 2_000;

    private final SpatialReferenceSystemsDao srsDao;

    public AddCustomSrsRequestHandler(SpatialReferenceSystemsDao srsDao,
                                      RpcProducer rpcProducer,
                                      IAuthenticationFacade authenticationFacade) {
        super(rpcProducer, authenticationFacade);
        this.srsDao = srsDao;
    }

    @Override
    @Transactional
    public SpatialReferenceSystem handle(AddCustomSrsRequest request) {
        SpatialReferenceSystem newSrs = request.getSrs();
        newSrs.setSrtext(StringUtils.normalizeSpace(newSrs.getSrtext()));

        // Заменить или добавить authority в WKT
        try {
            Optional<String> oAuthName = Optional.ofNullable(
                    CRS.parseWKT(newSrs.getSrtext())
                       .getCoordinateSystem()
                       .getName()
                       .getCodeSpace());

            if (oAuthName.isPresent()) {
                // Заменить authority в строке WKT

                newSrs.setAuthName(oAuthName.get());
            } else {
                // Добавить authority

                newSrs.setAuthName("NEED_ADD_AUTHORITY");
            }
        } catch (Exception e) {
            throw createProjectionValidationException(e);
        }

        // Проверяем проекцию и выводим из wkt proj4 строку.
        validateProjectionAndSetProj4(newSrs, newSrs.getSrtext());

        // Сохранили в БД - получили id
        addToPostgis(newSrs);

        // Заменим или добавим в строку WKT authority и вывести новый proj4 строку
        SpatialReferenceSystem finalSrs = prepareFinalSrs(newSrs);

        try {
            srsDao.update(finalSrs);
        } catch (CrgDaoException e) {
            throw new DataServiceException("Не удалось обновить проекцию => " + e.getMessage());
        }

        // На геосервер
        Optional<?> result = sendGeoserverRequest(finalSrs, "ADD", "добавить", true);
        if (result.isEmpty()) {
            log.info("Не удалось добавить проекцию: [{}] на геосервер", finalSrs);

            throw new DataServiceException("Не удалось добавить проекцию");
        }

        log.info("Добавление проекции [{}] на геосервер прошло успешно", finalSrs);

        return finalSrs;
    }

    private SpatialReferenceSystem prepareFinalSrs(SpatialReferenceSystem newSrs) {
        SpatialReferenceSystem finalSrs = new SpatialReferenceSystem();
        finalSrs.setAuthSrid(newSrs.getAuthSrid());

        String finalWkt;
        if (newSrs.getAuthName().equals("NEED_ADD_AUTHORITY")) {
            finalWkt = addAuthority(newSrs.getSrtext(), "EPSG", newSrs.getAuthSrid()).orElseThrow();
        } else {
            finalWkt = replaceAuthority(newSrs.getSrtext(), "EPSG", newSrs.getAuthSrid()).orElseThrow();
        }

        finalSrs.setAuthName("EPSG");
        finalSrs.setSrtext(finalWkt);

        validateProjectionAndSetProj4(finalSrs, finalWkt);

        return finalSrs;
    }

    private void addToPostgis(SpatialReferenceSystem newSrs) {
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

        // Сохраняем проекцию
        try {
            srsDao.addSrs(newSrs);
        } catch (CrgDaoException e) {
            throw new BadRequestException("Ошибка при выполнении SQL запроса: " + e.getMessage());
        } catch (Exception e) {
            throw new DataServiceException("Не удалось добавить проекцию => " + e.getMessage());
        }
    }
}
