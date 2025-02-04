package ru.mycrg.data_service.service.resources;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.service.resources.protectors.DatasetProtector;
import ru.mycrg.data_service.service.resources.protectors.TableProtector;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;
import java.util.Optional;

import static org.springframework.web.servlet.HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE;

@Component
public class ResourcesInterceptor implements HandlerInterceptor {

    private final Logger log = LoggerFactory.getLogger(ResourcesInterceptor.class);

    private final TableProtector tableProtector;
    private final DatasetProtector datasetProtector;

    public ResourcesInterceptor(DatasetProtector datasetProtector,
                                TableProtector tableProtector) {
        this.tableProtector = tableProtector;
        this.datasetProtector = datasetProtector;
    }

    @Override
    public boolean preHandle(@NotNull HttpServletRequest request,
                             @NotNull HttpServletResponse response,
                             @NotNull Object handler) {
        if (isRequestToTables(request)) {
            log.debug("ResourcesInterceptor request path: '{}'", request.getServletPath());

            String datasetId = getAttribute(request, "datasetId")
                    .orElseThrow(() -> new BadRequestException("Not found attribute 'datasetId'"));
            String tableId = getAttribute(request, "tableId")
                    .orElseThrow(() -> new BadRequestException("Not found attribute 'tableId'"));

            ResourceQualifier tableResource = new ResourceQualifier(datasetId, tableId);

            tableProtector.throwIfNotExist(tableResource);
        } else if (isRequestToDatasets(request)) {
            getAttribute(request, "datasetId").ifPresent(datasetId -> {
                datasetProtector.throwIfNotExist(new ResourceQualifier(datasetId));
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
            log.warn("Cant get attributes from request. Reason: {}", e.getMessage());

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
