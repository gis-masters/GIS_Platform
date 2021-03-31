package ru.mycrg.resource_analyzer_contract;

import java.util.List;

public interface IResourceQueryService {

    List<IResource> getResources();

    IResourceDefinition getResourceDefinition();
}
