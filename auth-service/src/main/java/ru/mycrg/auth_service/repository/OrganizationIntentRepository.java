package ru.mycrg.auth_service.repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.mycrg.auth_service.entity.OrganizationIntent;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OrganizationIntentRepository extends CrudRepository<OrganizationIntent, Long> {

    Optional<OrganizationIntent> findByToken(String token);

    Optional<OrganizationIntent> findByEmail(String token);

    @Modifying
    @Query(value = "DELETE FROM OrganizationIntent WHERE createdAt < :dateTime")
    void deleteExpiredTokens(@Param("dateTime") LocalDateTime dateTime);
}
