package ru.mycrg.data_service.dto;

import java.text.MessageFormat;
import java.util.HashSet;
import java.util.Set;

public class RegistryData {

    private final Set<String> allowedDirectlyDocumentIds = new HashSet<>();
    private final Set<String> pathsToChildren = new HashSet<>();
    private final Set<String> pathsToMyParent = new HashSet<>();

    public void addId(String id) {
        this.allowedDirectlyDocumentIds.add(id);
    }

    public void addPaths(String path, String id) {
        pathsToChildren.add(MessageFormat.format("{0}/{1}/%", path, id));
        pathsToMyParent.add(MessageFormat.format("{0}/{1}", path, id));
    }

    public Set<String> getAllowedDirectlyDocumentIds() {
        return allowedDirectlyDocumentIds;
    }

    public Set<String> getChildrenPaths() {
        return pathsToChildren;
    }

    public Set<String> getParentPaths() {
        return pathsToMyParent;
    }

    public boolean isEmpty() {
        return allowedDirectlyDocumentIds.isEmpty() && pathsToChildren.isEmpty() && pathsToMyParent.isEmpty();
    }
}
