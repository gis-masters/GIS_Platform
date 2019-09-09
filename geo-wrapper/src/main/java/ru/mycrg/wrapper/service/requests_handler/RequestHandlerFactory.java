package ru.mycrg.wrapper.service.requests_handler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.enums.ProcessType;
import ru.mycrg.wrapper.service.CreateOrganizationRequestHandler;
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
    private final IRequestHandler createOrganizationRequestHandler;

    public RequestHandlerFactory(CreateOrganizationRequestHandler createOrganizationRequestHandler,
                                 CreateProjectRequestHandler createProjectRequestHandler,
                                 DeleteProjectRequestHandler deleteProjectRequestHandler,
                                 ValidationService validationService,
                                 ExportRequestHandler exportRequestHandler,
                                 ImportRequestHandler importRequestHandler) {
        this.validationService = validationService;

        this.importRequestHandler = importRequestHandler;
        this.exportRequestHandler = exportRequestHandler;

        this.createProjectRequestHandler = createProjectRequestHandler;
        this.deleteProjectRequestHandler = deleteProjectRequestHandler;

        this.createOrganizationRequestHandler = createOrganizationRequestHandler;
    }

    // TODO: Implement UPDATE_PROJECT
    IRequestHandler getHandler(ProcessType type) throws Exception {
        switch (type) {
            case CREATE_ORG:        return createOrganizationRequestHandler;
            case CREATE_PROJECT:    return createProjectRequestHandler;
            case DELETE_PROJECT:    return deleteProjectRequestHandler;
            case IMPORT:            return importRequestHandler;
            case VALIDATION:        return validationService;
            case EXPORT:            return exportRequestHandler;
            default:
                log.warn("Not supported process type: {}", type);

                throw new Exception("Not supported process type: " + type.toString());
        }
    }
}
