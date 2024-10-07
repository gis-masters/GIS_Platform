package ru.mycrg.data_service.service.cqrs.reestrs.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dao.CommonDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.cqrs.reestrs.requests.CreateReestrRecordRequest;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.geo_json.Feature;
import ru.mycrg.mediator.IRequestHandler;

import java.util.Map;
import java.util.UUID;

import static java.time.LocalDateTime.now;
import static ru.mycrg.data_service.service.resources.ResourceQualifier.systemTable;

@Component
public class CreateReestrRecordRequestHandler implements IRequestHandler<CreateReestrRecordRequest, IRecord> {

    private final CommonDao commonDao;
    private final IAuthenticationFacade authenticationFacade;

    public CreateReestrRecordRequestHandler(CommonDao commonDao,
                                            IAuthenticationFacade authenticationFacade) {
        this.commonDao = commonDao;
        this.authenticationFacade = authenticationFacade;
    }

    @Override
    public IRecord handle(CreateReestrRecordRequest request) {
        String tableName = request.getTableName();
        IRecord record = request.getRecord();
        SchemaDto schema = request.getSchema();

        Map<String, Object> content = record.getContent();
        // System attributes
        content.put("id", UUID.randomUUID());
        content.put("user_from", authenticationFacade.getLogin());
        content.put("date_in", now());

        try {
            return commonDao.save(systemTable(tableName), new Feature(content), schema);
        } catch (CrgDaoException e) {
            throw new DataServiceException("Не удалось сохранить запись в реестр");
        }
    }
}
