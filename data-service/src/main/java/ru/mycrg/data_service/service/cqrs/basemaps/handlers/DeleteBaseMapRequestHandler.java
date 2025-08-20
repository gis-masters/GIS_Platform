package ru.mycrg.data_service.service.cqrs.basemaps.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.entity.BaseMap;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.BaseMapRepository;
import ru.mycrg.data_service.service.cqrs.basemaps.requests.DeleteBaseMapRequest;
import ru.mycrg.data_service_contract.queue.request.BasemapReferencesDeletionEvent;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

@Component
public class DeleteBaseMapRequestHandler implements IRequestHandler<DeleteBaseMapRequest, Voidy> {

    private final BaseMapRepository baseMapRepository;
    private final IMessageBusProducer messageBus;
    private final IAuthenticationFacade authenticationFacade;

    public DeleteBaseMapRequestHandler(BaseMapRepository baseMapRepository, IMessageBusProducer messageBus,
                                       IAuthenticationFacade authenticationFacade) {
        this.baseMapRepository = baseMapRepository;
        this.messageBus = messageBus;
        this.authenticationFacade = authenticationFacade;
    }

    @Override
    public Voidy handle(DeleteBaseMapRequest request) {
        Long id = request.getId();
        BaseMap baseMap = baseMapRepository
                .findById(id)
                .orElseThrow(() -> new NotFoundException("Не найдена картографическая подоснова: " + id));

        baseMapRepository.deleteById(id);

        messageBus.produce(new BasemapReferencesDeletionEvent(baseMap.getId(),
                                                              baseMap.getLayerName(),
                                                              authenticationFacade.getAccessToken()));

        return new Voidy();
    }
}
