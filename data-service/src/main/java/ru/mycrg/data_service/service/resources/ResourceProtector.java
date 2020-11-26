package ru.mycrg.data_service.service.resources;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.exceptions.ConflictException;
import ru.mycrg.data_service.exceptions.NotFoundException;

@Service
public class ResourceProtector {

    private final ResourceManagerFactory resourceManagerFactory;

    public ResourceProtector(ResourceManagerFactory resourceManagerFactory) {
        this.resourceManagerFactory = resourceManagerFactory;
    }

    public void throwIfNotExist(@NotNull ResourceIdentifier rIdentifier) {
        if (!resourceManagerFactory.get(rIdentifier).isExist(rIdentifier)) {
            throw new NotFoundException(rIdentifier.toString());
        }
    }

    public void throwIfExists(@NotNull ResourceIdentifier rIdentifier) {
        if (resourceManagerFactory.get(rIdentifier).isExist(rIdentifier)) {
            throw new ConflictException("The resource " + rIdentifier.toString() + " already exist");
        }
    }
}
