package ru.mycrg.auth_service.service.specialization;

import com.fasterxml.jackson.core.type.TypeReference;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service.exceptions.BadRequestException;
import ru.mycrg.common_contracts.specialization.Specialization;

import java.io.IOException;
import java.util.List;

import static ru.mycrg.auth_service.AuthJWTApplication.mapper;

@Service
public class SpecializationService {

    private static final String SPECIALIZATIONS_FILE_NAME = "specializations/specializations.json";

    private final List<Specialization> specializations;

    public SpecializationService(ResourceLoader resourceLoader) throws IOException {
        Resource specializationsAsResource = resourceLoader.getResource("classpath:" + SPECIALIZATIONS_FILE_NAME);

        this.specializations = mapper.readValue(specializationsAsResource.getInputStream(),
                                                new TypeReference<List<Specialization>>() {
                                                });
    }

    public List<Specialization> getAllSpecializations() {
        return specializations;
    }

    public Specialization getSpecialization(int specId) {
        return specializations.stream()
                              .filter(item -> item.getId() == specId)
                              .findFirst()
                              .orElseThrow(() -> new BadRequestException("Запрашиваемая специализация не найдена"));
    }
}
