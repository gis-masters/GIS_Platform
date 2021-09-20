package ru.mycrg.data_service.service.resource_analyze.queries;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.entity.BaseMap;
import ru.mycrg.data_service.service.BasemapsService;
import ru.mycrg.resource_analyzer_contract.IResource;
import ru.mycrg.resource_analyzer_contract.IResourceDefinition;
import ru.mycrg.resource_analyzer_contract.IResourceQueryService;
import ru.mycrg.resource_analyzer_contract.impl.Resource;
import ru.mycrg.resource_analyzer_contract.impl.ResourceDefinition;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class BasemapQuery implements IResourceQueryService {

    private final BasemapsService basemapsService;
    private final ResourceDefinition resourceDefinition;

    public BasemapQuery(BasemapsService basemapsService) {
        this.basemapsService = basemapsService;

        resourceDefinition = new ResourceDefinition("BaseMaps", "Подложки");
    }

    public Page<IResource> getResources(Pageable pageable) {
        final List<IResource> result = basemapsService.getWithNotNullLayerName(pageable).stream()
                                                      .map(this::mapBaseMapToResource)
                                                      .collect(Collectors.toList());

        return new PageImpl<>(result, pageable, result.size());
    }

    @Override
    public IResourceDefinition getResourceDefinition() {
        return resourceDefinition;
    }

    private IResource mapBaseMapToResource(BaseMap baseMap) {
        final Map<String, Object> resProps = new HashMap<>();
        resProps.put("layerName", baseMap.getLayerName());

        return new Resource(String.valueOf(baseMap.getId()), baseMap.getTitle(), resourceDefinition, resProps);
    }
}
