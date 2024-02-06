package ru.mycrg.data_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.BaseDao;
import ru.mycrg.data_service.entity.EpsgModel;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.util.Collections;
import java.util.List;

import static ru.mycrg.data_service.dao.config.DatasourceFactory.INITIAL_SCHEMA_NAME;

@Service
public class EpsgService {

    private final Logger log = LoggerFactory.getLogger(EpsgService.class);

    private final String SPATIAL_TABLE_NAME = "spatial_ref_sys";

    private final BaseDao baseDao;

    private final ResourceQualifier tableQualifier;

    public EpsgService(BaseDao baseDao) {
        this.baseDao = baseDao;

        this.tableQualifier = new ResourceQualifier(INITIAL_SCHEMA_NAME, SPATIAL_TABLE_NAME);
    }

    public Page<EpsgModel> getAll(String ecqlFilter, Pageable pageable) {
        try {
            List<EpsgModel> epsg = baseDao.findAll(tableQualifier,
                                                   ecqlFilter,
                                                   pageable,
                                                   EpsgModel.class);

            Long total = baseDao.total(tableQualifier, ecqlFilter);

            return new PageImpl<>(Collections.unmodifiableList(epsg), pageable, total);
        } catch (BadSqlGrammarException e) {
            String msg = e.getCause().getMessage();
            log.warn("Bad request: {}", msg);

            throw new BadRequestException(msg);
        }
    }
}
