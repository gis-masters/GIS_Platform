package ru.mycrg.data_service.repository.smev;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.entity.smev.SmevMessageMetaEntity;

import java.util.UUID;

/**
 * Для сохранения мето информации запросов в СМЭВ
 */
@Repository
public interface SmevMessageMetaRepository extends PagingAndSortingRepository<SmevMessageMetaEntity, UUID> {

}
