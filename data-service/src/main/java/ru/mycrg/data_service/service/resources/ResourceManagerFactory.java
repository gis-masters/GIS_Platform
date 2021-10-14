package ru.mycrg.data_service.service.resources;

import org.jetbrains.annotations.NotNull;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.SchemasManager;
import ru.mycrg.data_service.dao.TablesManager;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.DocumentLibraryService;

@Service
public class ResourceManagerFactory {

    private final ApplicationContext context;

    public ResourceManagerFactory(ApplicationContext context) {
        this.context = context;
    }

    @NotNull
    public ResourceManager get(@NotNull ResourceQualifier rQualifier) {
        switch (rQualifier.getType()) {
            case DATASET:
                return context.getBean(SchemasManager.class);
            case TABLE:
                return context.getBean(TablesManager.class);
            case LIBRARY:
                return context.getBean(DocumentLibraryService.class);
            default:
                throw new DataServiceException("Not supported resource type: " + rQualifier.getType());
        }
    }
}
