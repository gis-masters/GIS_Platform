package ru.mycrg.data_service.service.cqrs.midelwares;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.common_contracts.generated.ecp.VerifyEcpResponse;
import ru.mycrg.data_service.service.cqrs.files.ICreateFilesRelation;
import ru.mycrg.data_service.service.cqrs.files.IDeleteFilesRelation;
import ru.mycrg.data_service.service.cqrs.files.IUpdateFilesRelation;
import ru.mycrg.data_service.service.files.FileService;
import ru.mycrg.data_service.service.schemas.ISchemable;
import ru.mycrg.mediator.IRequest;
import ru.mycrg.mediator.IRequestMiddleware;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static ru.mycrg.data_service.service.schemas.SchemaUtil.isFilePropertyExist;

@Component
public class FilesRelationMiddleware implements IRequestMiddleware {

    private final Logger log = LoggerFactory.getLogger(FilesRelationMiddleware.class);

    private final FileService fileService;

    public FilesRelationMiddleware(FileService fileService) {
        this.fileService = fileService;
    }

    @Override
    public <Response, Request extends IRequest<Response>> Response invoke(Request request, Next<Response> next) {
        Response response = next.invoke();

        if (!(request instanceof ISchemable)) {
            return response;
        }

        ISchemable schemable = (ISchemable) request;
        if (!isFilePropertyExist(schemable.getSchema())) {
            return response;
        }

        if (request instanceof ICreateFilesRelation) {
            ICreateFilesRelation createFilesRelation = (ICreateFilesRelation) request;

            Map<UUID, List<VerifyEcpResponse>> ecpReport = fileService
                    .relateFiles(createFilesRelation.getSchema(),
                                 createFilesRelation.getQualifier(),
                                 createFilesRelation.getRecord());

            createFilesRelation.addEcpReport(ecpReport);
        } else if (request instanceof IUpdateFilesRelation) {
            IUpdateFilesRelation updateFilesRelation = (IUpdateFilesRelation) request;

            Map<UUID, List<VerifyEcpResponse>> ecpReport = fileService
                    .relateFilesByUpdate(updateFilesRelation.getSchema(),
                                         updateFilesRelation.getQualifier(),
                                         updateFilesRelation.getNewRecord(),
                                         updateFilesRelation.getOldRecord());

            updateFilesRelation.addEcpReport(ecpReport);
        } else if (request instanceof IDeleteFilesRelation) {
            // IDeleteFilesRelation deleteFilesRelation = (IDeleteFilesRelation) request;
            // закомментировано, так как решается вопрос о том каким образом будут подчищаться хвосты
            // deleteRelatedFiles(deleteFilesRelation.getSchema(), deleteFilesRelation.getRecord());
        } else {
            log.warn("Unknown request type");
        }

        return response;
    }
}
