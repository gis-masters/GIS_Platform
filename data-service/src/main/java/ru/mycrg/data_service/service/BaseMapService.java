package ru.mycrg.data_service.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dto.BaseMapProjection;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.BaseMapRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BaseMapService {

    private final BaseMapRepository baseMapRepository;
    private final ProjectionFactory projectionFactory;

    public BaseMapService(BaseMapRepository baseMapRepository,
                          ProjectionFactory projectionFactory) {
        this.baseMapRepository = baseMapRepository;
        this.projectionFactory = projectionFactory;
    }

    public Page<BaseMapProjection> getPaged(Pageable pageable) {
        return baseMapRepository.findAll(pageable)
                                .map(baseMap -> projectionFactory.createProjection(BaseMapProjection.class, baseMap));
    }

    public BaseMapProjection getById(Long id) {
        return baseMapRepository.findById(id)
                                .map(baseMap -> projectionFactory.createProjection(BaseMapProjection.class, baseMap))
                                .orElseThrow(() -> new NotFoundException("Не найдена подложка с id:" + id));
    }

    public Page<BaseMapProjection> searchByIds(List<Long> ids, Pageable pageable) {
        return baseMapRepository.findByIdIn(ids, pageable)
                                .map(baseMap -> projectionFactory.createProjection(BaseMapProjection.class, baseMap));
    }

    public List<BaseMapProjection> getPluggableToNewProject() {
        return baseMapRepository.findBaseMapByPluggableToNewProjectIsTrue()
                                .stream()
                                .map(baseMap -> projectionFactory.createProjection(BaseMapProjection.class, baseMap))
                                .collect(Collectors.toList());
    }
}
