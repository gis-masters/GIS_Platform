package ru.mycrg.data_service.kpt_import.writer;

import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.detached.DetachedRecordsDao;
import ru.mycrg.data_service.kpt_import.model.KptElement;
import ru.mycrg.data_service.kpt_import.model.TerZoneElement;

import java.util.Collections;
import java.util.List;

@Service
public class TerZoneWriter extends KptElementDBWriter {

    public static final String TER_ZONE_PRO_SCHEMA = "ter_zone_pro";

    public TerZoneWriter(DetachedRecordsDao recordsDao) {
        super(recordsDao);
    }

    @Override
    public List<Class<? extends KptElement>> getTargetClasses() {
        return Collections.singletonList(TerZoneElement.class);
    }

    @Override
    public String getSchemaName() {
        return TER_ZONE_PRO_SCHEMA;
    }
}
