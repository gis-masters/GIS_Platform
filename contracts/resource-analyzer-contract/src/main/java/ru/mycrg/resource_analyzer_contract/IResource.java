package ru.mycrg.resource_analyzer_contract;

import java.util.Map;

public interface IResource {

    String getId();

    String getTitle();

    IResourceDefinition getResourceDefinition();

    Map<String, Object> getResourceProperties();
}
