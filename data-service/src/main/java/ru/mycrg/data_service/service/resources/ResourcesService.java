package ru.mycrg.data_service.service.resources;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.entity.Resource;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.ResourceRepository;

@Service
public class ResourcesService {

    private final ResourceRepository resRepository;

    public ResourcesService(ResourceRepository resRepository) {
        this.resRepository = resRepository;
    }

    @NotNull
    public Resource get(ResourceIdentifier resIdentifier) {
        return resRepository.findByTypeAndIdentifier(resIdentifier.getType().name(), resIdentifier.toString())
                            .orElseThrow(() -> new NotFoundException(resIdentifier.toString()));
    }
}
