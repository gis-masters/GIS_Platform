package ru.mycrg.data_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.ConnectionInfo;
import ru.mycrg.data_service.dao.DaoException;
import ru.mycrg.data_service.dao.basemaps.CrgBaseMapsDao;
import ru.mycrg.data_service.dto.IBaseMap;
import ru.mycrg.data_service.dto.XYZBaseMapDto;
import ru.mycrg.data_service.dto.XYZSource;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.dao.DaoDefaults.DATA_SCHEMA_NAME;
import static ru.mycrg.data_service.dao.DaoDefaults.DEFAULT_DB_NAME;
import static ru.mycrg.data_service.mappers.BaseMapMapper.baseMapMapper;

@Service
public class BaseMapsService {

    private static final Logger log = LoggerFactory.getLogger(BaseMapsService.class);

    private final CrgBaseMapsDao daoBaseMap;

    private final String BASE_MAPS_TABLE_NAME = "base_maps";

    public BaseMapsService(CrgBaseMapsDao daoBaseMap) {
        this.daoBaseMap = daoBaseMap;
    }

    public List<IBaseMap> getAll(Long orgId, List<Long> baseMapsIds) {
        try {
            final ConnectionInfo connectionInfo = ConnectionInfo.builder()
                    .dbName(DEFAULT_DB_NAME + orgId)
                    .schemaName(DATA_SCHEMA_NAME)
                    .tableName(BASE_MAPS_TABLE_NAME)
                    .build();

            return daoBaseMap.getAll(baseMapsIds, connectionInfo).stream()
                    .map(baseMapEntity -> {
                        switch (baseMapEntity.getType()) {
                            case OSM:
                                return baseMapMapper.toXYZBaseMap(baseMapEntity);
                            case XYZ:
                                return baseMapMapper.toXYZBaseMap(baseMapEntity);
                            case WMTS:
                                return baseMapMapper.toWMTSBaseMap(baseMapEntity);
                            default:
                                log.warn("Not supported baseMap type: {}", baseMapEntity.getType());
                                return baseMapMapper.toXYZBaseMap(baseMapEntity);
                        }
                    })
                    .collect(Collectors.toList());
        } catch (DaoException e) {
            log.error("Не удалось получить подложки для организации: {}. {}", orgId, e.getMessage());

            return Collections.singletonList(
                    new XYZBaseMapDto(-1, "osm", "Open street map", "/assets/images/thumbnail-osm.jpg",
                            new XYZSource()));
        }
    }
}
