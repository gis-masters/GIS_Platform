package ru.mycrg.data_service.service.resources;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import ru.mycrg.data_service.exceptions.DataServiceException;

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
            Optional<String> oDataSet = getAttribute(request, "dataSetName");
            Optional<String> oTable = getAttribute(request, "tableName");

            if (oDataSet.isPresent() && oTable.isPresent()) {
                ResourceIdentifier datasetResource = new ResourceIdentifier(oDataSet.get(), SCHEMA);
                ResourceIdentifier tableResource = new ResourceIdentifier(oTable.get(), TABLE, datasetResource);

                resourceProtector.throwIfNotExist(tableResource);
            } else {
                throw new DataServiceException("Incorrect path: " + request.getRequestURI());
            }
        } else if (isRequestToDatasets(request)) {
            getAttribute(request, "dataSetName").ifPresent(dataSetName -> {
                resourceProtector.throwIfNotExist(new ResourceIdentifier(dataSetName, SCHEMA));
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
