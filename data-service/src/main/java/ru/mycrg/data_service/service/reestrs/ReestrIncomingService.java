package ru.mycrg.data_service.service.reestrs;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.entity.reestrs.ReestrIncoming;
import ru.mycrg.data_service.repository.reestrs.ReestrIncomingRepository;

@Service
public class ReestrIncomingService {
    private static final Logger log = LoggerFactory.getLogger(ReestrIncomingService.class);
    private final ReestrIncomingRepository incomingRepository;

    public ReestrIncomingService(ReestrIncomingRepository incomingRepository) {
        this.incomingRepository = incomingRepository;
    }

    @Transactional
    public void save(ReestrIncoming message) {
        log.debug("Try to save reestr record: " + message.toString());
        incomingRepository.save(message);
        log.info("Reestr record saved. id:{}", message.getId());
    }

    @Transactional
    public ReestrIncoming findByBody(String body){
        return incomingRepository.findFirstByBodyContains(body);
    }
}
