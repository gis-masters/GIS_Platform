package ru.mycrg.resource_analyzer_contract;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IResourceQueryService {

    Page<IResource> getResources(Pageable pageable);

    IResourceDefinition getResourceDefinition();
}
