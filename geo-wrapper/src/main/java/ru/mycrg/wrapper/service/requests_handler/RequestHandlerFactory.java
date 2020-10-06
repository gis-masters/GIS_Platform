package ru.mycrg.wrapper.service.requests_handler;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.IUserEvent;
import ru.mycrg.auth_service_contract.UserCreatedEvent;
import ru.mycrg.auth_service_contract.UserDeletedEvent;
import ru.mycrg.mq_queue_contract.enums.ProcessType;
import ru.mycrg.wrapper.exceptions.QueueException;
import ru.mycrg.wrapper.service.export.ExportRequestHandler;
import ru.mycrg.wrapper.service.import_.ImportRequestHandler;
import ru.mycrg.wrapper.service.users.CreateUserRequestHandler;
import ru.mycrg.wrapper.service.users.DeleteUserRequestHandler;
import ru.mycrg.wrapper.service.validation.ValidationService;

@Service
public class RequestHandlerFactory {

    private final Logger log = LoggerFactory.getLogger(RequestHandlerFactory.class);

    private final IRequestHandler importRequestHandler;
    private final IRequestHandler validationService;
    private final IRequestHandler exportRequestHandler;

    private final IUserRequestHandler createUserRequestHandler;
    private final IUserRequestHandler deleteUserRequestHandler;

    public RequestHandlerFactory(ValidationService validationService,
                                 ExportRequestHandler exportRequestHandler,
                                 ImportRequestHandler importRequestHandler,
                                 CreateUserRequestHandler createUserRequestHandler,
                                 DeleteUserRequestHandler deleteUserRequestHandler) {
        this.validationService = validationService;

        this.importRequestHandler = importRequestHandler;
        this.exportRequestHandler = exportRequestHandler;

        this.createUserRequestHandler = createUserRequestHandler;
        this.deleteUserRequestHandler = deleteUserRequestHandler;
    }

    IRequestHandler getHandler(@NotNull ProcessType type) throws QueueException {
        switch (type) {
            case IMPORT:            return importRequestHandler;
            case VALIDATION:        return validationService;
            case EXPORT:            return exportRequestHandler;
            default:
                log.warn("Not supported process type: {}", type);

                throw new QueueException("Not supported process type: " + type.toString());
        }
    }

    IUserRequestHandler getUserHandler(@NotNull IUserEvent mqEvent) throws QueueException {
        if (mqEvent instanceof UserCreatedEvent) {
            return createUserRequestHandler;
        } else if (mqEvent instanceof UserDeletedEvent) {
            return deleteUserRequestHandler;
        } else {
            throw new QueueException("Not supported user event");
        }
    }
}
