package ru.mycrg.data_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.data.rest.core.annotation.HandleBeforeCreate;
import org.springframework.data.rest.core.annotation.HandleBeforeSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.entity.BaseMap;
import ru.mycrg.data_service.exceptions.CrgValidationException;
import ru.mycrg.data_service.exceptions.DataServiceException;

import javax.validation.ConstraintViolation;
import javax.validation.Validator;
import java.util.Set;

import static ru.mycrg.data_service.mappers.BaseMapMapper.baseMapMapper;

@Service
@RepositoryEventHandler
public class BaseMapsService {

    public static final Logger log = LoggerFactory.getLogger(BaseMapsService.class);

    private final Validator validator;

    public BaseMapsService(Validator validator) {
        this.validator = validator;
    }

    @Transactional
    @HandleBeforeCreate
    public void beforeCreate(BaseMap baseMap) {
        validate(baseMapMapper.toDto(baseMap));
    }

    @Transactional
    @HandleBeforeSave
    public void beforeSave(BaseMap baseMap) {
        validate(baseMapMapper.toDto(baseMap));
    }

    /**
     * Cannot be executed in transaction block
     * @param jdbcTemplate Template of current db
     */
    public void initDefault(JdbcTemplate jdbcTemplate) {
        log.debug("init default baseMaps");

        String addEmpty = "INSERT INTO data.base_maps (name, title, thumbnail_urn, type)" +
                " SELECT 'empty', 'Без подложки', '/assets/images/thumbnail-empty.jpg', 'XYZ'" +
                " WHERE NOT EXISTS(SELECT id FROM data.base_maps WHERE name = 'empty');";

        String addOsm = "INSERT INTO data.base_maps (name, title, thumbnail_urn, type)" +
                " SELECT 'osm', 'Open street map', '/assets/images/thumbnail-osm.jpg', 'OSM'" +
                " WHERE NOT EXISTS(SELECT id FROM data.base_maps WHERE name = 'osm');";

        String addEsriMap = "INSERT INTO data.base_maps (name, title, thumbnail_urn, type, url)" +
                " SELECT 'esri', 'ESRI Карта', '/assets/images/thumbnail-esri.jpg', 'XYZ', " +
                "'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'" +
                " WHERE NOT EXISTS(SELECT id FROM data.base_maps WHERE name = 'esri');";

        String addEsriImagery = "INSERT INTO data.base_maps (name, title, thumbnail_urn, type, url)" +
                " SELECT 'esriImagery', 'ESRI Спутник', '/assets/images/thumbnail-our.jpg', 'XYZ', " +
                "'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'" +
                " WHERE NOT EXISTS(SELECT id FROM data.base_maps WHERE name = 'esriImagery');";

        try {
            jdbcTemplate.execute(addEmpty);
            jdbcTemplate.execute(addOsm);
            jdbcTemplate.execute(addEsriMap);
            jdbcTemplate.execute(addEsriImagery);
        } catch (DataAccessException e) {
            log.error(e.toString());

            throw new DataServiceException("Не удалось проинициализировать подложки", e.getCause());
        }
    }

    private <T> void validate(T bean) {
        Set<ConstraintViolation<T>> violations = validator.validate(bean);
        if (!violations.isEmpty()) {
            throw new CrgValidationException(violations);
        }
    }
}
