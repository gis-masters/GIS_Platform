package ru.mycrg.data_service.service.cqrs.basemaps.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dto.BaseMapCreateDto;
import ru.mycrg.data_service.entity.BaseMap;
import ru.mycrg.data_service.repository.BaseMapRepository;
import ru.mycrg.data_service.service.cqrs.basemaps.requests.CreateBaseMapRequest;
import ru.mycrg.mediator.IRequestHandler;

import static ru.mycrg.data_service.mappers.BasemapMapper.basemapMapper;

@Component
public class CreateBaseMapRequestHandler implements IRequestHandler<CreateBaseMapRequest, BaseMap> {

    private final BaseMapRepository baseMapRepository;

    public CreateBaseMapRequestHandler(BaseMapRepository baseMapRepository) {
        this.baseMapRepository = baseMapRepository;
    }

    @Override
    public BaseMap handle(CreateBaseMapRequest request) {
        BaseMapCreateDto baseMapCreateDto = request.getBaseMapCreateDto();

        BaseMap savedBaseMap = baseMapRepository.save(basemapMapper.toEntity(baseMapCreateDto));
        request.setEntity(savedBaseMap);

        return savedBaseMap;
    }
}
