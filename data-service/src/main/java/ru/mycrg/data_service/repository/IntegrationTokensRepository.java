package ru.mycrg.data_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.entity.IntegrationTokens;

import java.util.Optional;

@Repository
public interface IntegrationTokensRepository extends JpaRepository<IntegrationTokens, Long> {

    Optional<IntegrationTokens> getByServiceName(String serviceName);
}
