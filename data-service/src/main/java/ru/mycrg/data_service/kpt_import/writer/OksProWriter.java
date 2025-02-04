package ru.mycrg.data_service.kpt_import.writer;

import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.detached.DetachedRecordsDao;
import ru.mycrg.data_service.kpt_import.model.KptElement;
import ru.mycrg.data_service.kpt_import.model.oks.OksBuildingPolygonElement;
import ru.mycrg.data_service.kpt_import.model.oks.OksConstructionPolygonElement;
import ru.mycrg.data_service.kpt_import.model.oks.OksUnderConstructionPolygonElement;

import java.util.Arrays;
import java.util.List;

@Service
public class OksProWriter extends KptElementDBWriter {

    public static final String OKS_PRO_SCHEMA = "oks_pro";

    public OksProWriter(DetachedRecordsDao recordsDao) {
        super(recordsDao);
    }

    @Override
    public List<Class<? extends KptElement>> getTargetClasses() {
        return Arrays.asList(OksConstructionPolygonElement.class, OksBuildingPolygonElement.class,
                             OksUnderConstructionPolygonElement.class);
    }

    @Override
    public String getSchemaName() {
        return OKS_PRO_SCHEMA;
    }
}
