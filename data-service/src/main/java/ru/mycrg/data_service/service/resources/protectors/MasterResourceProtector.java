package ru.mycrg.data_service.service.resources.protectors;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dto.ResourceType;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.util.List;
import java.util.Map;
import java.util.function.Function;

import static java.util.stream.Collectors.toMap;

@Component
public class MasterResourceProtector implements IMasterResourceProtector {

    private final Map<ResourceType, IResourceProtector> protectors;

    public MasterResourceProtector(List<IResourceProtector> protectors) {
        this.protectors = protectors.stream()
                                    .collect(toMap(IResourceProtector::getType, Function.identity()));
    }

    @Override
    public void throwIfNotExist(@NotNull ResourceQualifier qualifier) {
        protectors.get(qualifier.getType())
                  .throwIfNotExist(qualifier);
    }

    @Override
    public void throwIfExists(@NotNull ResourceQualifier qualifier) {
        protectors.get(qualifier.getType())
                  .throwIfExists(qualifier);
    }

    @Override
    public boolean isOwner(ResourceQualifier qualifier) {
        return protectors.get(qualifier.getType())
                         .isOwner(qualifier);
    }

    @Override
    public boolean isAllowed(ResourceQualifier qualifier) {
        return protectors.get(qualifier.getType())
                         .isAllowed(qualifier);
    }

    @Override
    public boolean isEditAllowed(ResourceQualifier qualifier) {
        return protectors.get(qualifier.getType())
                         .isEditAllowed(qualifier);
    }
}
