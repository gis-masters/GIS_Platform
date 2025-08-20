package ru.mycrg.data_service.dao;

import org.jetbrains.annotations.NotNull;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dao.utils.SqlParameterSourceFactory;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.dto.record.RecordEntity;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.geo_json.Feature;

import static ru.mycrg.data_service.dao.utils.SqlBuilder.buildParameterizedInsertQuery;

@Repository
@Transactional
public class CommonDao {

    private final BaseWriteDao pBaseDao;
    private final SqlParameterSourceFactory sqlParameterSourceFactory;

    public CommonDao(BaseWriteDao pBaseDao,
                     SqlParameterSourceFactory parameterSourceMapperFactory) {
        this.pBaseDao = pBaseDao;
        this.sqlParameterSourceFactory = parameterSourceMapperFactory;
    }

    public IRecord save(@NotNull ResourceQualifier qualifier,
                        @NotNull Feature feature,
                        @NotNull SchemaDto schema) throws CrgDaoException {
        String query = buildParameterizedInsertQuery(qualifier, feature, false);
        MapSqlParameterSource parameterSource = sqlParameterSourceFactory.buildParameterizedSource(feature, schema);

        pBaseDao.update(query, parameterSource);

        return new RecordEntity(feature.getProperties());
    }
}
