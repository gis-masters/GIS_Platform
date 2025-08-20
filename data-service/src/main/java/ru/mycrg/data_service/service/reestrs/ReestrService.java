package ru.mycrg.data_service.service.reestrs;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.Map;
import java.util.UUID;

import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.dto.ResourceType.REESTR;

@Service
@Transactional(readOnly = true)
public class ReestrService {

    private final RecordsDao recordsDao;
    private final ReestrsService reestrsService;

    public ReestrService(RecordsDao recordsDao,
                         ReestrsService reestrsService) {
        this.recordsDao = recordsDao;
        this.reestrsService = reestrsService;
    }

    public Map<String, Object> getById(String tableName, UUID id) {
        SchemaDto schema = reestrsService.getSchema(tableName);

        return recordsDao
                .findById(new ResourceQualifier(SYSTEM_SCHEMA_NAME, tableName, id, REESTR), schema)
                .orElseThrow(() -> new NotFoundException(id))
                .getContent();
    }
}
