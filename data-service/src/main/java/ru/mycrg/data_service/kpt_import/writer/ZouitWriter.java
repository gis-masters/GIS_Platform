package ru.mycrg.data_service.kpt_import.writer;

import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.detached.DetachedRecordsDao;
import ru.mycrg.data_service.kpt_import.model.KptElement;
import ru.mycrg.data_service.kpt_import.model.ZouitElement;

import java.util.Collections;
import java.util.List;

@Service
public class ZouitWriter extends KptElementDBWriter {

    public static final String ZOUIT_PRO_SCHEMA = "zouit_pro";

    protected ZouitWriter(DetachedRecordsDao recordsDao) {
        super(recordsDao);
    }

    @Override
    public List<Class<? extends KptElement>> getTargetClasses() {
        return Collections.singletonList(ZouitElement.class);
    }

    @Override
    public String getSchemaName() {
        return ZOUIT_PRO_SCHEMA;
    }
}
