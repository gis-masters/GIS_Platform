package ru.mycrg.data_service.kpt_import.writer;

import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.detached.DetachedRecordsDao;
import ru.mycrg.data_service.kpt_import.model.KptElement;
import ru.mycrg.data_service.kpt_import.model.oks.OksConstructionPointElement;
import ru.mycrg.data_service.kpt_import.model.oks.OksUnderConstructionPointElement;

import java.util.Arrays;
import java.util.List;

@Service
public class OksConstructionPointWriter extends KptElementDBWriter {

    public static final String OKS_CONSTRUCTIONS_POINTS_SCHEMA = "oks_constructions_points";

    protected OksConstructionPointWriter(DetachedRecordsDao recordsDao) {
        super(recordsDao);
    }

    @Override
    public List<Class<? extends KptElement>> getTargetClasses() {
        return Arrays.asList(OksConstructionPointElement.class, OksUnderConstructionPointElement.class);
    }

    @Override
    public String getSchemaName() {
        return OKS_CONSTRUCTIONS_POINTS_SCHEMA;
    }
}
