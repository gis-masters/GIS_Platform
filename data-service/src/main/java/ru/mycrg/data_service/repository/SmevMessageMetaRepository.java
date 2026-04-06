package ru.mycrg.data_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.entity.smev.SmevMessageMetaEntity;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SmevMessageMetaRepository extends JpaRepository<SmevMessageMetaEntity, UUID> {
    Optional<SmevMessageMetaEntity> findByClientId(UUID clientId);
}
