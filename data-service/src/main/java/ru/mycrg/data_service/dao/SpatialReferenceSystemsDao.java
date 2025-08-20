package ru.mycrg.data_service.dao;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.stereotype.Repository;
import ru.mycrg.common_contracts.generated.SpatialReferenceSystem;
import ru.mycrg.common_contracts.generated.data_service.DatasetAndTableModel;
import ru.mycrg.data_service.dao.core.CoreReadDao;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

import static ru.mycrg.data_service.dao.config.DatasourceFactory.SYSTEM_SCHEMA_NAME;
import static ru.mycrg.data_service.service.resources.DatasetService.SCHEMAS_AND_TABLES_QUALIFIER;
import static ru.mycrg.data_service.service.srs.SpatialReferenceSystemService.spatialTableQualifier;

@Repository
public class SpatialReferenceSystemsDao {

    private final Logger log = LoggerFactory.getLogger(SpatialReferenceSystemsDao.class);

    private final CoreReadDao coreReadDao;
    private final BaseWriteDao baseWriteDao;

    private volatile AtomicInteger sridCounter;

    public SpatialReferenceSystemsDao(CoreReadDao coreReadDao,
                                      BaseWriteDao baseWriteDao) {
        this.coreReadDao = coreReadDao;
        this.baseWriteDao = baseWriteDao;
    }

    public List<DatasetAndTableModel> findDatasetsAndTablesModel(Long srid)
            throws CrgDaoException {
        try {
            String query = "SELECT t2.title AS dataset_title, t2.identifier AS dataset_identifier," +
                    " t1.title AS table_title, t1.identifier AS table_name" +
                    " FROM " + SYSTEM_SCHEMA_NAME + "." + SCHEMAS_AND_TABLES_QUALIFIER.getTable() + " AS t1" +
                    " LEFT JOIN " + SYSTEM_SCHEMA_NAME + "." + SCHEMAS_AND_TABLES_QUALIFIER.getTable() + " AS t2" +
                    " ON t2.id = (split_part(t1.path, '/', 3))::int" +
                    " WHERE t1.crs like 'EPSG:" + srid + "';";

            log.debug("Execute search fullData query: [{}]", query);

            return coreReadDao.query(query, DatasetAndTableModel.class);
        } catch (DataAccessException e) {
            throw new CrgDaoException(e.getMessage());
        }
    }

    public void update(SpatialReferenceSystem srs) throws CrgDaoException {
        try {
            MapSqlParameterSource parameterSource = new MapSqlParameterSource();
            parameterSource.addValue("srid", srs.getAuthSrid());
            parameterSource.addValue("authName", srs.getAuthName());
            parameterSource.addValue("srtext", srs.getSrtext());
            parameterSource.addValue("proj4text", srs.getProj4Text());

            String query = "UPDATE public.spatial_ref_sys " +
                    " SET srtext = :srtext, " +
                    "     proj4text = :proj4text," +
                    "     auth_name = :authName" +
                    " WHERE srid = :srid";

            baseWriteDao.update(query, parameterSource);
        } catch (Exception e) {
            throw new CrgDaoException(e.getMessage());
        }
    }

    public void addSrs(SpatialReferenceSystem srs) throws CrgDaoException {
        try {
            MapSqlParameterSource parameterSource = new MapSqlParameterSource();
            parameterSource.addValue("srid", srs.getAuthSrid());
            parameterSource.addValue("auth_srid", srs.getAuthSrid());
            parameterSource.addValue("auth_name", srs.getAuthName() == null ? "CRG" : srs.getAuthName());
            parameterSource.addValue("srtext", srs.getSrtext());
            parameterSource.addValue("proj4text", srs.getProj4Text());

            baseWriteDao.update("INSERT INTO public.spatial_ref_sys (srid, auth_srid, auth_name, srtext, proj4text) " +
                                        "values (:srid, :auth_srid, :auth_name, :srtext, :proj4text)", parameterSource);
        } catch (Exception e) {
            throw new CrgDaoException("Не удалось добавить проекцию => " + e.getMessage());
        }
    }

    public void removeSrs(Integer srid) throws CrgDaoException {
        baseWriteDao.removeRecord(spatialTableQualifier, "srid", srid);
    }

    public boolean exists(long srid) {
        String query = String.format("SELECT EXISTS (SELECT * FROM public.spatial_ref_sys WHERE srid = %d)", srid);

        log.debug("Execute 'exists' query: [{}]", query);

        return coreReadDao.exists(query);
    }

    /**
     * У талицы spatial_ref_sys нет sequence, поэтому ищем свободный идентификатор в заданном диапазоне. Использует
     * AtomicInteger для предотвращения race condition между потоками.
     *
     * @return Свободный идентификатор.
     */
    public Optional<Integer> getNextSrid(Integer from, Integer to) {
        if (sridCounter == null) {
            synchronized (this) {
                if (sridCounter == null) {
                    return getNextSridFromDbQuery(from, to);
                }
            }
        }

        int nextSrid = sridCounter.incrementAndGet();
        if (nextSrid > to) {
            log.warn("SRID counter exceeded upper bound: {} > {}", nextSrid, to);

            return Optional.empty();
        }

        log.debug("Generated next SRID from counter: {}", nextSrid);

        return Optional.of(nextSrid);
    }

    private @NotNull Optional<Integer> getNextSridFromDbQuery(Integer from, Integer to) {
        String query = "SELECT generated_id FROM public.spatial_ref_sys " +
                "  RIGHT JOIN generate_series(" + from + ", " + to + ") AS generated_id ON (srid = generated_id) " +
                "WHERE srid IS NULL " +
                "LIMIT 1";

        log.debug("Execute 'getNextSrid' query (first time): [{}]", query);

        Optional<Integer> result = coreReadDao.queryForObject(query, Integer.class);
        if (result.isPresent()) {
            sridCounter = new AtomicInteger(result.get());
            log.debug("Initialized SRID counter with value: {}", result.get());

            return result;
        } else {
            log.warn("No free SRID found in range [{}, {}]", from, to);

            return Optional.empty();
        }
    }
}
