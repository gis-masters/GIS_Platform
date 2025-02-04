package ru.mycrg.data_service.service.reestrs;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.dto.reestrs.ReestrProjection;
import ru.mycrg.data_service.entity.reestrs.Reestr;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.reestrs.ReestrRepository;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.schemas.ISchemaTemplateService;
import ru.mycrg.data_service_contract.dto.SchemaDto;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.service.resources.ResourceQualifier.systemTable;
import static ru.mycrg.data_service.util.MapUtil.clearNullable;

@Service
@Transactional(readOnly = true)
public class ReestrsService {

    private static final String COMMON_SCHEMA_NAME = "reestr_common_schema";

    private final RecordsDao recordsDao;
    private final ISchemaTemplateService schemaService;
    private final ReestrRepository reestrRepository;
    private final ProjectionFactory projectionFactory;

    public ReestrsService(RecordsDao recordsDao,
                          @Qualifier("schemaTemplateServiceBase") ISchemaTemplateService schemaService,
                          ReestrRepository reestrRepository,
                          ProjectionFactory projectionFactory) {
        this.recordsDao = recordsDao;
        this.schemaService = schemaService;
        this.reestrRepository = reestrRepository;
        this.projectionFactory = projectionFactory;
    }

    public ReestrProjection get(String tableName) {
        return reestrRepository.findByTableNameIgnoreCase(tableName)
                               .map(reestr -> projectionFactory.createProjection(ReestrProjection.class, reestr))
                               .orElseThrow(() -> new NotFoundException(tableName));
    }

    public Page<ReestrProjection> getAll(Pageable pageable) {
        return reestrRepository.findAll(pageable)
                               .map(reestr -> projectionFactory.createProjection(ReestrProjection.class, reestr));
    }

    public Page<Map<String, Object>> getAll(String tableName, Pageable pageable, String ecqlFilter) {
        ResourceQualifier reestrQualifier = systemTable(tableName);
        SchemaDto schema = getSchema(tableName);

        List<Map<String, Object>> result = recordsDao.findAll(reestrQualifier, ecqlFilter, schema, pageable).stream()
                                                     .map(iRecord -> clearNullable(iRecord.getContent()))
                                                     .collect(Collectors.toList());
        Long total = recordsDao.getTotal(reestrQualifier, ecqlFilter);

        return new PageImpl<>(Collections.unmodifiableList(result), pageable, total);
    }

    public SchemaDto getSchema() {
        return schemaService.getSchemaByName(COMMON_SCHEMA_NAME)
                            .orElseThrow(() -> new NotFoundException("Не найдена схема: " + COMMON_SCHEMA_NAME));
    }

    public SchemaDto getSchema(String tableName) {
        Reestr reestr = getReestr(tableName);

        return schemaService.getSchemaByName(reestr.getSchemaName())
                            .orElseThrow(() -> new NotFoundException("Не найдена схема: " + reestr.getSchemaName()));
    }

    private Reestr getReestr(String tableName) {
        return reestrRepository.findByTableNameIgnoreCase(tableName)
                               .orElseThrow(() -> new NotFoundException("Не найден реестр", tableName));
    }
}
