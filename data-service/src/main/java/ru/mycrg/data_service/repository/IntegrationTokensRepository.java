package ru.mycrg.data_service.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import ru.mycrg.data_service.entity.IntegrationTokens;

import java.util.Optional;

@Repository
public interface IntegrationTokensRepository extends PagingAndSortingRepository<IntegrationTokens, Long> {

    Optional<IntegrationTokens> getByServiceName(String serviceName);
}
