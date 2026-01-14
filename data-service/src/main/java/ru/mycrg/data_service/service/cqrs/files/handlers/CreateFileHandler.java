package ru.mycrg.data_service.service.cqrs.files.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.common_contracts.generated.data_service.FileResponse;
import ru.mycrg.data_service.service.cqrs.files.requests.CreateFileRequest;
import ru.mycrg.mediator.IRequestHandler;

import java.util.List;

@Component
public class CreateFileHandler implements IRequestHandler<CreateFileRequest, List<FileResponse>> {

    private static final Logger log = LoggerFactory.getLogger(CreateFileHandler.class);

    private final IAuthenticationFacade authenticationFacade;
    private final CreateFileHandlerDetached createFile;
    private final JdbcTemplate jdbcTemplate;

    public CreateFileHandler(IAuthenticationFacade authenticationFacade,
                             CreateFileHandlerDetached createFile,
                             JdbcTemplate jdbcTemplate) {
        this.authenticationFacade = authenticationFacade;
        this.createFile = createFile;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<FileResponse> handle(CreateFileRequest request) {
        log.debug("Перенаправляем запрос на создание файла в detached реализацию");

        return createFile.handle(
                request.getFiles(),
                jdbcTemplate,
                authenticationFacade.getLogin()
        );
    }
}
