package ru.mycrg.wrapper.service.import_;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.common.enums.ProcessStatus;
import ru.mycrg.common.import_.ImportMqRequest;
import ru.mycrg.common.import_.ImportMqResponse;
import ru.mycrg.wrapper.dao.PostGisStorage;
import ru.mycrg.wrapper.mq.IMqEvents;

@Service
@Transactional
public class ImportService {

    private static final Logger log = LoggerFactory.getLogger(ImportService.class);

    private final IMqEvents mqEvents;
    private final PostGisStorage postGisStorage;

    public ImportService(PostGisStorage postGisStorage, IMqEvents mqEvents) {
        this.postGisStorage = postGisStorage;
        this.mqEvents = mqEvents;
    }

    public void doImport(ImportMqRequest request) {
        postGisStorage.doImport(request);
    }
}
