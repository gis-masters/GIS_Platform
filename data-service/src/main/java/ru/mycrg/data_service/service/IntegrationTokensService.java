package ru.mycrg.data_service.service;

import org.springframework.stereotype.Service;
import ru.mycrg.data_service.entity.IntegrationTokens;
import ru.mycrg.data_service.repository.IntegrationTokensRepository;

import java.util.Optional;

@Service
public class IntegrationTokensService {

    private final IntegrationTokensRepository integrationTokensRepository;

    public IntegrationTokensService(IntegrationTokensRepository integrationTokensRepository) {
        this.integrationTokensRepository = integrationTokensRepository;
    }

    public Optional<IntegrationTokens> getByServiceName(String serviceName) {
        return integrationTokensRepository.getByServiceName(serviceName);
    }
}
