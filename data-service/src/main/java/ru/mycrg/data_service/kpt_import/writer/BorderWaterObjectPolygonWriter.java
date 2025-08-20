package ru.mycrg.data_service.kpt_import.writer;

import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.detached.DetachedRecordsDao;
import ru.mycrg.data_service.kpt_import.model.BorderWaterObjectPolygonElement;
import ru.mycrg.data_service.kpt_import.model.KptElement;

import java.util.Collections;
import java.util.List;

@Service
public class BorderWaterObjectPolygonWriter extends KptElementDBWriter {

    public static final String BORDERWATEROBJ_SCHEMA = "borderwaterobj";

    protected BorderWaterObjectPolygonWriter(DetachedRecordsDao recordsDao) {
        super(recordsDao);
    }

    @Override
    public List<Class<? extends KptElement>> getTargetClasses() {
        return Collections.singletonList(BorderWaterObjectPolygonElement.class);
    }

    @Override
    public String getSchemaName() {
        return BORDERWATEROBJ_SCHEMA;
    }
}
