package ru.mycrg.data_service.kpt_import.writer;

import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.detached.DetachedRecordsDao;
import ru.mycrg.data_service.kpt_import.model.KptElement;
import ru.mycrg.data_service.kpt_import.model.MunicipalityBoundaryElement;

import java.util.Collections;
import java.util.List;

@Service
public class MunicipalityBoundaryWriter extends KptElementDBWriter {

    public static final String MUNICIPALITY_BOUNDARIES_EGRN_SCHEMA = "municipality_boundaries_egrn";

    protected MunicipalityBoundaryWriter(DetachedRecordsDao recordsDao) {
        super(recordsDao);
    }

    @Override
    public List<Class<? extends KptElement>> getTargetClasses() {
        return Collections.singletonList(MunicipalityBoundaryElement.class);
    }

    @Override
    public String getSchemaName() {
        return MUNICIPALITY_BOUNDARIES_EGRN_SCHEMA;
    }
}
