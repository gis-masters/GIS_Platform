package ru.mycrg.auth_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.auth_service.entity.OrganizationIntent;
import ru.mycrg.auth_service.entity.User;
import ru.mycrg.auth_service.exceptions.ConflictException;
import ru.mycrg.auth_service.repository.OrganizationIntentRepository;
import ru.mycrg.auth_service.repository.UserRepository;
import ru.mycrg.auth_service.service.specialization.SpecializationService;
import ru.mycrg.auth_service_contract.dto.OrganizationIntentDto;

import java.util.Optional;

@Service
public class OrganizationIntentService {

    private static final Logger log = LoggerFactory.getLogger(OrganizationIntentService.class);

    private final EmailService emailService;
    private final UserRepository userRepository;
    private final SpecializationService specializationService;
    private final OrganizationIntentRepository intentRepository;

    public OrganizationIntentService(UserRepository userRepository,
                                     OrganizationIntentRepository intentRepository,
                                     SpecializationService specializationService,
                                     EmailService emailService) {
        this.userRepository = userRepository;
        this.intentRepository = intentRepository;
        this.specializationService = specializationService;
        this.emailService = emailService;
    }

    @Transactional
    public void addIntent(OrganizationIntentDto intentDto) {
        throwIfEmailExist(intentDto.getEmail());

        if (intentDto.getSpecializationId() != null) {
            specializationService.getSpecialization(intentDto.getSpecializationId());
        }

        OrganizationIntent intent = new OrganizationIntent(intentDto);
        intentRepository.save(intent);
        log.debug("intent: '{}' saved", intent.getId());
        emailService.sendIntent(intent);
        log.debug("intent: '{}' sanded", intent.getId());
    }

    private void throwIfEmailExist(String email) {
        String msg = String.format("Почта: '%s' уже занята", email);

        intentRepository.findByEmail(email)
                        .ifPresent(intent -> {
                            throw new ConflictException(msg);
                        });

        Optional<User> userByEmail = userRepository.findByEmail(email);
        if (userByEmail.isPresent()) {
            throw new ConflictException(msg);
        }
    }
}
