package ru.mycrg.data_service.kpt_import.writer;

import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.detached.DetachedRecordsDao;
import ru.mycrg.data_service.kpt_import.model.KptElement;
import ru.mycrg.data_service.kpt_import.model.ZouitElement;

import java.util.Collections;
import java.util.List;

@Service
public class ZouitWriter extends KptElementDBWriter {

    protected ZouitWriter(DetachedRecordsDao recordsDao) {
        super(recordsDao);
    }

    @Override
    public List<Class<? extends KptElement>> getTargetClasses() {
        return Collections.singletonList(ZouitElement.class);
    }

    @Override
    public String getSchemaName() {
        return "zouit_pro";
    }
}
