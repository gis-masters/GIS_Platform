package ru.mycrg.data_service.repository.reestrs;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.entity.reestrs.ReestrIncoming;

import java.util.UUID;

@Repository
public interface ReestrIncomingRepository extends PagingAndSortingRepository<ReestrIncoming, UUID> {

    ReestrIncoming findFirstByBodyContains(String originalMessageId);

}
