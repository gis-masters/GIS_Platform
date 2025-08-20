package ru.mycrg.data_service.service.cqrs.srs;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.DatasetAndTableModel;
import ru.mycrg.data_service.dao.SpatialReferenceSystemsDao;
import ru.mycrg.data_service.exceptions.BadRequestException;

import java.util.List;

@Service
public class FindObjectsBySridService {

    private final Logger log = LoggerFactory.getLogger(FindObjectsBySridService.class);

    private final SpatialReferenceSystemsDao spatialReferenceSystemsDao;

    public FindObjectsBySridService(SpatialReferenceSystemsDao spatialReferenceSystemsDao) {
        this.spatialReferenceSystemsDao = spatialReferenceSystemsDao;
    }

    public List<DatasetAndTableModel> findDatasetsAndTablesBySrid(Long srid) {
        List<DatasetAndTableModel> datasetAndTableModels;
        try {
            datasetAndTableModels = spatialReferenceSystemsDao.findDatasetsAndTablesModel(srid);
        } catch (Exception e) {
            log.error("Не удалось получить информацию по srid: {}", e.getMessage());

            throw new BadRequestException(e.getMessage());
        }

        return datasetAndTableModels;
    }
}
