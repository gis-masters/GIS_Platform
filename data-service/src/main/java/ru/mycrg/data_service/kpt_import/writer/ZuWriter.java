package ru.mycrg.data_service.kpt_import.writer;

import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.detached.DetachedRecordsDao;
import ru.mycrg.data_service.kpt_import.model.KptElement;
import ru.mycrg.data_service.kpt_import.model.ZuElement;

import java.util.Collections;
import java.util.List;

@Service
public class ZuWriter extends KptElementDBWriter {

    public static final String ZU_PRO_SCHEMA = "zu_pro";

    public ZuWriter(DetachedRecordsDao recordsDao) {
        super(recordsDao);
    }

    @Override
    public List<Class<? extends KptElement>> getTargetClasses() {
        return Collections.singletonList(ZuElement.class);
    }

    @Override
    public String getSchemaName() {
        return ZU_PRO_SCHEMA;
    }
}
