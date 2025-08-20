package ru.mycrg.data_service.service.schemas;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.BaseReadDao;
import ru.mycrg.data_service.dao.SpatialRecordsDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dao.mappers.FeatureRowMapper;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.protectors.IResourceProtector;
import ru.mycrg.data_service_contract.dto.ResourceQualifierDto;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.geo_json.Feature;

import java.util.List;

import static org.springframework.data.domain.Sort.Direction.ASC;
import static ru.mycrg.data_service.dao.config.DaoProperties.PRIMARY_KEY;
import static ru.mycrg.data_service.util.DetailedLogger.logError;

@Service
public class CustomRulesRecalculationService {

    private final Logger log = LoggerFactory.getLogger(CustomRulesRecalculationService.class);

    private final BaseReadDao baseDao;
    private final SchemaExtractor schemaExtractor;
    private final SpatialRecordsDao spatialRecordsDao;
    private final IResourceProtector datasetProtector;
    private final CustomRuleCalculator customRuleCalculator;

    public CustomRulesRecalculationService(CustomRuleCalculator customRuleCalculator,
                                           SpatialRecordsDao spatialRecordsDao,
                                           BaseReadDao baseDao,
                                           SchemaExtractor schemaExtractor,
                                           IResourceProtector datasetProtector) {
        this.baseDao = baseDao;
        this.schemaExtractor = schemaExtractor;
        this.customRuleCalculator = customRuleCalculator;
        this.spatialRecordsDao = spatialRecordsDao;
        this.datasetProtector = datasetProtector;
    }

    public void recalculate(List<ResourceQualifierDto> rQualifiersDto) {
        for (ResourceQualifierDto resourceQualifier: rQualifiersDto) {
            ResourceQualifier rQualifier = new ResourceQualifier(resourceQualifier.getSchema(),
                                                                 resourceQualifier.getTable());
            SchemaDto schema = schemaExtractor.get(rQualifier)
                                              .orElseThrow(() -> new NotFoundException(rQualifier.getTableQualifier()));
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
                    customRuleCalculator.calculate(schema, oldFeature.getProperties())
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
}
