package ru.mycrg.data_service.service.resources;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import ru.mycrg.data_service.dto.ResourceType;

public class ResourceIdentifier {

    public static final String SEPARATOR = ".";

    @NotNull
    private final String id;

    @NotNull
    private final ResourceType type;

    @Nullable
    private ResourceIdentifier parent;

    public ResourceIdentifier(@NotNull String id, @NotNull ResourceType type) {
        this.id = id;
        this.type = type;
    }

    public ResourceIdentifier(@NotNull String id, @NotNull ResourceType type, @Nullable ResourceIdentifier parent) {
        this.id = id;
        this.type = type;
        this.parent = parent;
    }

    @NotNull
    public String getId() {
        return id;
    }

    @NotNull
    public ResourceType getType() {
        return type;
    }

    @NotNull
    public ResourceIdentifier getParent() {
        if (parent == null) {
            throw new IllegalStateException("Empty parent id");
        }

        return parent;
    }

    @NotNull
    public String toString() {
        return parent == null ? id : parent.toString() + SEPARATOR + id;
    }
}
