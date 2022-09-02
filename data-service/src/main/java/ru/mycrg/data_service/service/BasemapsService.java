package ru.mycrg.data_service.service;

import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.core.annotation.HandleAfterDelete;
import org.springframework.data.rest.core.annotation.HandleBeforeCreate;
import org.springframework.data.rest.core.annotation.HandleBeforeSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.entity.BaseMap;
import ru.mycrg.data_service.exceptions.CrgValidationException;
import ru.mycrg.data_service.repository.BaseMapRepository;
import ru.mycrg.data_service_contract.queue.request.BasemapReferencesDeletionEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import javax.validation.ConstraintViolation;
import javax.validation.Validator;
import java.util.Set;

import static ru.mycrg.data_service.mappers.BasemapMapper.basemapMapper;

@Service
@RepositoryEventHandler
public class BasemapsService {

    private final Validator validator;
    private final IMessageBusProducer messageBus;
    private final IAuthenticationFacade authenticationFacade;
    private final BaseMapRepository baseMapRepository;

    public BasemapsService(Validator validator,
                           IMessageBusProducer messageBus,
                           IAuthenticationFacade authenticationFacade,
                           BaseMapRepository baseMapRepository) {
        this.validator = validator;
        this.messageBus = messageBus;
        this.authenticationFacade = authenticationFacade;
        this.baseMapRepository = baseMapRepository;
    }

    @Transactional
    @HandleBeforeCreate
    public void beforeCreate(BaseMap baseMap) {
        validate(basemapMapper.toDto(baseMap));
    }

    @Transactional
    @HandleBeforeSave
    public void beforeSave(BaseMap baseMap) {
        validate(basemapMapper.toDto(baseMap));
    }

    @Transactional
    @HandleAfterDelete
    public void afterDelete(@NotNull BaseMap baseMap) {
        messageBus.produce(
                new BasemapReferencesDeletionEvent(baseMap.getId(),
                                                   baseMap.getLayerName(),
                                                   authenticationFacade.getAccessToken()));
    }

    public Page<BaseMap> getWithNotNullLayerName(Pageable pageable) {
        return baseMapRepository.findBaseMapByLayerNameNotNull(pageable);
    }

    private <T> void validate(T bean) {
        Set<ConstraintViolation<T>> violations = validator.validate(bean);
        if (!violations.isEmpty()) {
            throw new CrgValidationException(violations);
        }
    }
}
