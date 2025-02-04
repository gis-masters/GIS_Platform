package ru.mycrg.data_service.repository.reestrs;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.entity.reestrs.ReestrOutgoing;

import java.util.UUID;

@Repository
public interface ReestrOutgoingRepository extends PagingAndSortingRepository<ReestrOutgoing, UUID> {

}
