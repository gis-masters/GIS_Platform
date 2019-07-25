package ru.mycrg.wrapper.service.requests_handler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.enums.ProcessType;
import ru.mycrg.wrapper.service.CreateOrganizationRequestHandler;
import ru.mycrg.wrapper.service.CreateProjectRequestHandler;
import ru.mycrg.wrapper.service.export.ExportRequestHandler;
import ru.mycrg.wrapper.service.import_.ImportService;
import ru.mycrg.wrapper.service.validation.ValidationService;

@Service
public class RequestHandlerFactory {

    private final Logger log = LoggerFactory.getLogger(RequestHandlerFactory.class);

    private final IRequestHandler importService;
    private final IRequestHandler validationService;
    private final IRequestHandler exportRequestHandler;
    private final IRequestHandler createProjectRequestHandler;
    private final IRequestHandler createOrganizationRequestHandler;

    public RequestHandlerFactory(CreateOrganizationRequestHandler createOrganizationRequestHandler,
                                 CreateProjectRequestHandler createProjectRequestHandler,
                                 ValidationService validationService,
                                 ExportRequestHandler exportRequestHandler,
                                 ImportService importService) {
        this.importService = importService;
        this.validationService = validationService;
        this.exportRequestHandler = exportRequestHandler;
        this.createProjectRequestHandler = createProjectRequestHandler;
        this.createOrganizationRequestHandler = createOrganizationRequestHandler;
    }

    IRequestHandler getHandler(ProcessType type) throws Exception {
        switch (type) {
            case CREATE_ORG:        return createOrganizationRequestHandler;
            case CREATE_PROJECT:    return createProjectRequestHandler;
            case IMPORT:            return importService;
            case VALIDATION:        return validationService;
            case EXPORT:            return exportRequestHandler;
            default:
                log.warn("Not supported process type: {}", type);

                throw new Exception("Not supported process type: " + type.toString());
        }
    }
}
