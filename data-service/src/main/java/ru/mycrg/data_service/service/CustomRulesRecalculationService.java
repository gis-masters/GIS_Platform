package ru.mycrg.data_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.BaseDao;
import ru.mycrg.data_service.dao.SpatialRecordsDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dao.mappers.FeatureRowMapper;
import ru.mycrg.data_service_contract.dto.ResourceQualifierDto;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.SchemasAndTablesRepository;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.protectors.IResourceProtector;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.geo_json.Feature;

import java.util.List;

import static org.springframework.data.domain.Sort.Direction.ASC;
import static ru.mycrg.data_service.dao.config.DaoProperties.PRIMARY_KEY;
import static ru.mycrg.data_service.util.DetailedLogger.logError;

@Service
public class CustomRulesRecalculationService {

    private final Logger log = LoggerFactory.getLogger(CustomRulesRecalculationService.class);

    private final CustomRuleCalculator customRuleCalculator;
    private final SpatialRecordsDao spatialRecordsDao;
    private final SchemasAndTablesRepository schemasAndTablesRepository;
    private final SchemaService schemaService;
    private final BaseDao baseDao;
    private final IResourceProtector datasetProtector;

    public CustomRulesRecalculationService(CustomRuleCalculator customRuleCalculator,
                                           SpatialRecordsDao spatialRecordsDao,
                                           SchemasAndTablesRepository schemasAndTablesRepository,
                                           SchemaService schemaService, BaseDao baseDao,
                                           IResourceProtector datasetProtector) {
        this.customRuleCalculator = customRuleCalculator;
        this.spatialRecordsDao = spatialRecordsDao;
        this.schemasAndTablesRepository = schemasAndTablesRepository;
        this.schemaService = schemaService;
        this.baseDao = baseDao;
        this.datasetProtector = datasetProtector;
    }

    public void recalculate(List<ResourceQualifierDto> rQualifiersDto) {
        for (ResourceQualifierDto resourceQualifier: rQualifiersDto) {
            ResourceQualifier rQualifier = new ResourceQualifier(resourceQualifier.getSchema(),
                                                                 resourceQualifier.getTable());
            SchemaDto schema = findSchemaForQualifier(rQualifier);
            if (!datasetProtector.isEditAllowed(new ResourceQualifier(resourceQualifier.getSchema()))) {
                log.error("Недостаточно прав для редактирования набора: {}", rQualifier.getSchema());

                throw new ForbiddenException("Недостаточно прав для редактирования набора: " + rQualifier.getSchema());
            }
            int page = 0;
            int size = 1000;
            while (true) {
                List<Feature> oldFeatures = baseDao.findAll(rQualifier,
                                                            null,
                                                            PageRequest.of(page, size, new Sort(ASC, PRIMARY_KEY)),
                                                            new FeatureRowMapper(schema));
                page++;

                if (oldFeatures.isEmpty()) {
                    break;
                }

                oldFeatures.forEach(oldFeature -> {
                    customRuleCalculator.culculate(schema, oldFeature.getProperties())
                                        .forEach(oldFeature::setProperty);
                });

                try {
                    spatialRecordsDao.batchUpdate(rQualifier, oldFeatures, schema);
                } catch (CrgDaoException ex) {
                    String msg = "Не удалось выполнить multipleUpdateWithCalculatedFields в таблице: " + rQualifier.getTable();
                    logError(msg, ex);

                    throw new DataServiceException(msg);
                }
            }
        }
    }

    private SchemaDto findSchemaForQualifier(ResourceQualifier rQualifier) {
        String schemaId = schemasAndTablesRepository.findSchemaIdByIdentifier(rQualifier.getTable())
                                                    .orElseThrow(() -> new NotFoundException(
                                                            rQualifier.getTableQualifier()));

        return schemaService.getSchemaByName(schemaId)
                            .orElseThrow(() -> new NotFoundException(rQualifier.getTableQualifier()));
    }
}
