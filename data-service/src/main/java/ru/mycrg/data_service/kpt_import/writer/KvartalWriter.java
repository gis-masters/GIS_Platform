package ru.mycrg.data_service.kpt_import.writer;

import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.detached.DetachedRecordsDao;
import ru.mycrg.data_service.kpt_import.model.KptElement;
import ru.mycrg.data_service.kpt_import.model.KvartalElement;

import java.util.Collections;
import java.util.List;

@Service
public class KvartalWriter extends KptElementDBWriter {

    public static final String KVARTAL_KPT_SCHEMA = "kvartal_kpt";

    protected KvartalWriter(DetachedRecordsDao recordsDao) {
        super(recordsDao);
    }

    @Override
    public List<Class<? extends KptElement>> getTargetClasses() {
        return Collections.singletonList(KvartalElement.class);
    }

    @Override
    public String getSchemaName() {
        return KVARTAL_KPT_SCHEMA;
    }
}
