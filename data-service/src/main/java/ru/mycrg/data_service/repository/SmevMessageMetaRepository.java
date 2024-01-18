package ru.mycrg.data_service.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.entity.smev.SmevMessageMetaEntity;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SmevMessageMetaRepository extends PagingAndSortingRepository<SmevMessageMetaEntity, UUID> {
    Optional<SmevMessageMetaEntity> findByClientId(UUID clientId);
}
