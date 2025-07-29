package ru.mycrg.data_service.service.cqrs.srs.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.common_contracts.generated.SpatialReferenceSystem;
import ru.mycrg.data_service.service.cqrs.srs.requests.AddCustomSrsRequest;
import ru.mycrg.data_service.service.cqrs.srs.requests.DeleteCustomSrsRequest;
import ru.mycrg.data_service.service.cqrs.srs.requests.UpdateCustomSrsRequest;
import ru.mycrg.mediator.IRequestHandler;

@Component
public class UpdateCustomSrsRequestHandler implements IRequestHandler<UpdateCustomSrsRequest, SpatialReferenceSystem> {

    private final Logger log = LoggerFactory.getLogger(UpdateCustomSrsRequestHandler.class);

    private final DeleteCustomSrsRequestHandler deleteHandler;
    private final AddCustomSrsRequestHandler addHandler;

    public UpdateCustomSrsRequestHandler(DeleteCustomSrsRequestHandler deleteHandler,
                                         AddCustomSrsRequestHandler addHandler) {
        this.deleteHandler = deleteHandler;
        this.addHandler = addHandler;
    }

    @Override
    @Transactional
    public SpatialReferenceSystem handle(UpdateCustomSrsRequest request) {
        int authSrid = request.getAuthSrid();

        deleteHandler.ensureUserSridAllowed(authSrid);

        SpatialReferenceSystem updatedSrs = request.getSrs();

        log.info("Пытаемся удалить проекцию [{}] на геосервере", authSrid);
        DeleteCustomSrsRequest deleteRequest = new DeleteCustomSrsRequest(authSrid);
        deleteRequest.setIsNeedToReloadGeoserver(false);
        deleteHandler.handle(deleteRequest);

        log.info("Удаление проекции [{}} на геосервере завершено.", authSrid);
        log.info("Добавляем проекцию номер [{}], с телом: {}", authSrid, updatedSrs.toString());

        updatedSrs.setAuthSrid(authSrid);
        AddCustomSrsRequest addRequest = new AddCustomSrsRequest(updatedSrs);

        return addHandler.handle(addRequest);
    }
}
