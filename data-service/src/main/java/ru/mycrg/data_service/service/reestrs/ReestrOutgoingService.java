package ru.mycrg.data_service.service.reestrs;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.entity.reestrs.ReestrOutgoing;
import ru.mycrg.data_service.repository.reestrs.ReestrOutgoingRepository;

@Service
public class ReestrOutgoingService {
    private static final Logger log = LoggerFactory.getLogger(ReestrOutgoingService.class);
    private final ReestrOutgoingRepository outgoingRepository;

    public ReestrOutgoingService(ReestrOutgoingRepository outgoingRepository) {
        this.outgoingRepository = outgoingRepository;
    }

    @Transactional
    public void save(ReestrOutgoing message) {
        log.debug("Try to save reestr record: " + message.toString());
        outgoingRepository.save(message);
        log.info("Reestr record saved. id:{}", message.getId());
    }
}
