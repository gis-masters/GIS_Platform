package ru.mycrg.data_service.service.resources;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import ru.mycrg.data_service.exceptions.NotFoundException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;
import java.util.Optional;

import static org.springframework.web.servlet.HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE;
import static ru.mycrg.data_service.dto.ResourceType.SCHEMA;
import static ru.mycrg.data_service.dto.ResourceType.TABLE;

@Component
public class ResourcesInterceptor implements HandlerInterceptor {

    public static final Logger log = LoggerFactory.getLogger(ResourcesInterceptor.class);

    private final ResourceProtector resourceProtector;

    public ResourcesInterceptor(ResourceProtector resourceProtector) {
        this.resourceProtector = resourceProtector;
    }

    @Override
    public boolean preHandle(@NotNull HttpServletRequest request,
                             @NotNull HttpServletResponse response,
                             @NotNull Object handler) {
        if (isRequestToTables(request)) {
            String datasetId = getAttribute(request, "datasetId")
                    .orElseThrow(() -> new NotFoundException("Not found attribute 'datasetId'"));
            String tableId = getAttribute(request, "tableId")
                    .orElseThrow(() -> new NotFoundException("Not found attribute 'tableId'"));

            ResourceIdentifier tableResource = new ResourceIdentifier(tableId, TABLE, datasetId, SCHEMA);

            resourceProtector.throwIfNotExist(tableResource);
        } else if (isRequestToDatasets(request)) {
            getAttribute(request, "dataSetId").ifPresent(dataSetId -> {
                resourceProtector.throwIfNotExist(new ResourceIdentifier(dataSetId, SCHEMA));
            });
        }

        return true;
    }

    @NotNull
    private Optional<String> getAttribute(@NotNull HttpServletRequest request, String attrName) {
        try {
            var attributes = (Map<String, String>) request.getAttribute(URI_TEMPLATE_VARIABLES_ATTRIBUTE);

            return Optional.ofNullable(attributes.get(attrName));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    private boolean isRequestToTables(HttpServletRequest request) {
        return request.getServletPath().contains("/tables/");
    }

    private boolean isRequestToDatasets(@NotNull HttpServletRequest request) {
        return request.getServletPath().contains("/datasets/");
    }
}
