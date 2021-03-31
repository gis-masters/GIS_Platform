package ru.mycrg.gis_service.service.analyzer;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.mycrg.gis_service.exceptions.NotFoundException;
import ru.mycrg.resource_analyzer_contract.IResource;
import ru.mycrg.resource_analyzer_contract.IResourceQueryService;

import java.util.List;
import java.util.function.Predicate;

@Service
public class GisServiceResourceQueryService {

    private final List<IResourceQueryService> queryServices;

    public GisServiceResourceQueryService(List<IResourceQueryService> queryServices) {
        this.queryServices = queryServices;
    }

    public Page<IResource> getPagedResources(String resourceType, Pageable pageable) {
        List<IResource> resources = queryServices.stream()
                                                 .filter(isQueryServiceTypeEquals(resourceType))
                                                 .findFirst()
                                                 .orElseThrow(() -> new NotFoundException(resourceType))
                                                 .getResources();

        return new PageImpl<>(resources, pageable, resources.size());
    }

    public Predicate<IResourceQueryService> isQueryServiceTypeEquals(String resourceType) {
        return queryService -> queryService.getResourceDefinition()
                                           .getType()
                                           .equals(resourceType);
    }
}
