package ru.mycrg.data_service.service;

import org.springframework.stereotype.Service;
import ru.mycrg.data_service.entity.IntegrationTokens;
import ru.mycrg.data_service.exceptions.DataServiceException;

import java.util.Optional;

@Service
public class ExternalStatementService {

    private final IntegrationTokensService integrationTokensService;

    public ExternalStatementService(IntegrationTokensService integrationTokensService) {
        this.integrationTokensService = integrationTokensService;
    }

    public String getTokenExternalStatement() {
        Optional<IntegrationTokens> oIntegrationAisUms = integrationTokensService
                .getByServiceName("external_statements");
        if (oIntegrationAisUms.isEmpty()) {
            throw new DataServiceException("Не найдена информация об интеграции с сервисом: external_statements");
        }

        return oIntegrationAisUms.get().getToken();
    }
}
