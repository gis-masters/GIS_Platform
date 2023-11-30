package ru.mycrg.data_service.kpt_import.writer;

import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.detached.DetachedRecordsDao;
import ru.mycrg.data_service.kpt_import.model.KptElement;
import ru.mycrg.data_service.kpt_import.model.ZuElement;

@Service
public class ZuWriter extends KptElementDBWriter {

    private static final String TABLE = "kpt_zu_pro";

    public ZuWriter(DetachedRecordsDao recordsDao) {
        super(recordsDao, TABLE);
    }

    @Override
    public Class<? extends KptElement> getTargetClass() {
        return ZuElement.class;
    }
}
