package ru.mycrg.data_service.kpt_import.writer;

import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.detached.DetachedRecordsDao;
import ru.mycrg.data_service.kpt_import.model.KptElement;
import ru.mycrg.data_service.kpt_import.model.oks.OksBuildingPolylineElement;
import ru.mycrg.data_service.kpt_import.model.oks.OksConstructionPolylineElement;
import ru.mycrg.data_service.kpt_import.model.oks.OksUnderConstructionPolylineElement;

import java.util.Arrays;
import java.util.List;

@Service
public class OksPolylineProWriter extends KptElementDBWriter {

    public OksPolylineProWriter(DetachedRecordsDao recordsDao) {
        super(recordsDao);
    }

    @Override
    public List<Class<? extends KptElement>> getTargetClasses() {
        return Arrays.asList(OksConstructionPolylineElement.class, OksBuildingPolylineElement.class,
                             OksUnderConstructionPolylineElement.class);
    }

    @Override
    public String getSchemaName() {
        return "oks_polyline_pro";
    }
}
