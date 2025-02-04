package ru.mycrg.data_service.service.cqrs.basemaps.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dto.BaseMapUpdateDto;
import ru.mycrg.data_service.entity.BaseMap;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.BaseMapRepository;
import ru.mycrg.data_service.service.cqrs.basemaps.requests.UpdateBaseMapRequest;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

import static java.time.LocalDateTime.now;
import static java.util.Objects.nonNull;

@Component
public class UpdateBaseMapRequestHandler implements IRequestHandler<UpdateBaseMapRequest, Voidy> {

    private final BaseMapRepository baseMapRepository;

    public UpdateBaseMapRequestHandler(BaseMapRepository baseMapRepository) {
        this.baseMapRepository = baseMapRepository;
    }

    @Override
    public Voidy handle(UpdateBaseMapRequest request) {
        Long baseMapId = request.getId();
        BaseMapUpdateDto dto = request.getBaseMapUpdate();

        BaseMap baseMapForUpdate = baseMapRepository
                .findById(baseMapId)
                .orElseThrow(() -> new NotFoundException("Не найдена картографическая подоснова: " + baseMapId));

        if (nonNull(dto.getName())) {
            baseMapForUpdate.setName(dto.getName());
        }

        if (nonNull(dto.getPluggableToNewProject())) {
            baseMapForUpdate.setPluggableToNewProject(dto.getPluggableToNewProject());
        }

        if (nonNull(dto.getPosition())) {
            baseMapForUpdate.setPosition(dto.getPosition());
        }

        if (nonNull(dto.getProjection())) {
            baseMapForUpdate.setProjection(dto.getProjection());
        }

        if (nonNull(dto.getResolution())) {
            baseMapForUpdate.setResolution(dto.getResolution());
        }

        if (nonNull(dto.getTitle())) {
            baseMapForUpdate.setTitle(dto.getTitle());
        }

        if (nonNull(dto.getLayerName())) {
            baseMapForUpdate.setLayerName(dto.getLayerName());
        }

        if (nonNull(dto.getFormat())) {
            baseMapForUpdate.setFormat(dto.getFormat());
        }

        if (nonNull(dto.getThumbnailUrn())) {
            baseMapForUpdate.setThumbnailUrn(dto.getThumbnailUrn());
        }

        if (nonNull(dto.getType())) {
            baseMapForUpdate.setType(dto.getType());
        }

        if (nonNull(dto.getUrl())) {
            baseMapForUpdate.setUrl(dto.getUrl());
        }

        baseMapForUpdate.setLastModified(now());

        request.setBaseMapModel(baseMapForUpdate);

        baseMapRepository.save(baseMapForUpdate);

        return new Voidy();
    }
}
