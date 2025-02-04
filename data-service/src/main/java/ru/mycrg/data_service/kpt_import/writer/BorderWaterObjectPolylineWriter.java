package ru.mycrg.data_service.kpt_import.writer;

import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.detached.DetachedRecordsDao;
import ru.mycrg.data_service.kpt_import.model.BorderWaterObjectPolylineElement;
import ru.mycrg.data_service.kpt_import.model.KptElement;

import java.util.Collections;
import java.util.List;

@Service
public class BorderWaterObjectPolylineWriter extends KptElementDBWriter {

    public static final String BORDERWATEROBJ_POLILYNE_PRO_SCHEMA = "borderwaterobj_polilyne_pro";

    protected BorderWaterObjectPolylineWriter(DetachedRecordsDao recordsDao) {
        super(recordsDao);
    }

    @Override
    public List<Class<? extends KptElement>> getTargetClasses() {
        return Collections.singletonList(BorderWaterObjectPolylineElement.class);
    }

    @Override
    public String getSchemaName() {
        return BORDERWATEROBJ_POLILYNE_PRO_SCHEMA;
    }
}
