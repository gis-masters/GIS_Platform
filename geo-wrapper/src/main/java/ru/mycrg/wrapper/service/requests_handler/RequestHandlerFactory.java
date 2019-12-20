package ru.mycrg.wrapper.service.requests_handler;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.*;
import ru.mycrg.mq_queue_contract.enums.ProcessType;
import ru.mycrg.wrapper.exceptions.QueueException;
import ru.mycrg.wrapper.service.organization.CreateOrganizationHandler;
import ru.mycrg.wrapper.service.export.ExportRequestHandler;
import ru.mycrg.wrapper.service.import_.ImportRequestHandler;
import ru.mycrg.wrapper.service.projects.create.CreateProjectRequestHandler;
import ru.mycrg.wrapper.service.projects.delete.DeleteProjectRequestHandler;
import ru.mycrg.wrapper.service.validation.ValidationService;

@Service
public class RequestHandlerFactory {

    private final Logger log = LoggerFactory.getLogger(RequestHandlerFactory.class);

    private final IRequestHandler importRequestHandler;
    private final IRequestHandler validationService;
    private final IRequestHandler exportRequestHandler;
    private final IRequestHandler createProjectRequestHandler;
    private final IRequestHandler deleteProjectRequestHandler;

    private final IOrganizationRequestHandler createOrganizationHandler;

    public RequestHandlerFactory(CreateProjectRequestHandler createProjectRequestHandler,
                                 DeleteProjectRequestHandler deleteProjectRequestHandler,
                                 ValidationService validationService,
                                 ExportRequestHandler exportRequestHandler,
                                 ImportRequestHandler importRequestHandler,
                                 CreateOrganizationHandler createOrganizationHandler) {
        this.validationService = validationService;

        this.importRequestHandler = importRequestHandler;
        this.exportRequestHandler = exportRequestHandler;

        this.createProjectRequestHandler = createProjectRequestHandler;
        this.deleteProjectRequestHandler = deleteProjectRequestHandler;

        this.createOrganizationHandler = createOrganizationHandler;
    }

    IRequestHandler getHandler(@NotNull ProcessType type) throws QueueException {
        switch (type) {
            case CREATE_PROJECT:    return createProjectRequestHandler;
            case DELETE_PROJECT:    return deleteProjectRequestHandler;
            case IMPORT:            return importRequestHandler;
            case VALIDATION:        return validationService;
            case EXPORT:            return exportRequestHandler;
            default:
                log.warn("Not supported process type: {}", type);

                throw new QueueException("Not supported process type: " + type.toString());
        }
    }

    IOrganizationRequestHandler getOrgHandler(@NotNull IOrganizationEvent mqEvent) throws QueueException {
        if (mqEvent instanceof OrganizationInitializedEvent) {
            return createOrganizationHandler;
        } else {
            throw new QueueException("Not supported event");
        }
    }
}
