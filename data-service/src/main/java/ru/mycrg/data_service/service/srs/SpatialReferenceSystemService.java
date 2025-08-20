package ru.mycrg.data_service.service.srs;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.SpatialReferenceSystem;
import ru.mycrg.data_service.dao.BaseReadDao;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.util.Collections;
import java.util.List;

import static ru.mycrg.data_service.dao.config.DatasourceFactory.INITIAL_SCHEMA_NAME;

@Service
public class SpatialReferenceSystemService {

    private final Logger log = LoggerFactory.getLogger(SpatialReferenceSystemService.class);

    private final BaseReadDao baseDao;

    public static final ResourceQualifier spatialTableQualifier =
            new ResourceQualifier(INITIAL_SCHEMA_NAME, "spatial_ref_sys");

    public SpatialReferenceSystemService(BaseReadDao baseDao) {
        this.baseDao = baseDao;
    }

    public Page<SpatialReferenceSystem> getAll(String ecqlFilter, Pageable pageable) {
        try {
            List<SpatialReferenceSystem> epsg = baseDao.findAll(spatialTableQualifier,
                                                                ecqlFilter,
                                                                pageable,
                                                                SpatialReferenceSystem.class);

            Long total = baseDao.total(spatialTableQualifier, ecqlFilter);

            return new PageImpl<>(Collections.unmodifiableList(epsg), pageable, total);
        } catch (BadSqlGrammarException e) {
            String msg = e.getCause().getMessage();
            log.warn("Bad request: {}", msg);

            throw new BadRequestException(msg);
        }
    }
}
