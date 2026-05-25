package ru.mycrg.data_service.kpt_import.writer;

import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.detached.DetachedRecordsDao;
import ru.mycrg.data_service.kpt_import.model.KptElement;
import ru.mycrg.data_service.kpt_import.model.NaturalAreaElement;

import java.util.Collections;
import java.util.List;

@Service
public class NaturalAreaWriter extends KptElementDBWriter {

    public static final String NATURAL_AREAS_PRO_SCHEMA = "natural_areas_pro";

    public NaturalAreaWriter(DetachedRecordsDao recordsDao) {
        super(recordsDao);
    }

    @Override
    public List<Class<? extends KptElement>> getTargetClasses() {
        return Collections.singletonList(NaturalAreaElement.class);
    }

    @Override
    public String getSchemaName() {
        return NATURAL_AREAS_PRO_SCHEMA;
    }
}
