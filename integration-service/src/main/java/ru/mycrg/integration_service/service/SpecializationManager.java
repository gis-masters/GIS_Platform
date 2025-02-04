package ru.mycrg.integration_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.common_contracts.specialization.Specialization;
import ru.mycrg.http_client.exceptions.HttpClientException;
import ru.mycrg.oauth_client.OAuthClient;

import java.util.HashMap;
import java.util.Map;

@Component
public class SpecializationManager {

    private static final Logger log = LoggerFactory.getLogger(SpecializationManager.class);

    private final OAuthClient oAuthClient;
    private final Map<Integer, Specialization> cache = new HashMap<>();

    public SpecializationManager(OAuthClient oAuthClient) {
        this.oAuthClient = oAuthClient;
    }

    public Specialization getSpecialization(int id) {
        if (cache.containsKey(id)) {
            log.debug("Специализация: '{}' взята из кеша", id);

            return cache.get(id);
        }

        try {
            Specialization specialization = oAuthClient.getSpecialization(id);

            cache.put(id, specialization);

            log.debug("Специализация: '{}' взята из auth-service", id);

            return specialization;
        } catch (HttpClientException e) {
            String msg = String.format("Не удалось получить специализацию: %d => %s", id, e.getMessage());

            throw new IllegalStateException(msg, e);
        }
    }
}
