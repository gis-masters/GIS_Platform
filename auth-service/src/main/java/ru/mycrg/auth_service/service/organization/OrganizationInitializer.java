package ru.mycrg.auth_service.service.organization;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.auth_service.entity.OrgInitOutbox;
import ru.mycrg.auth_service.entity.Organization;
import ru.mycrg.auth_service.entity.User;
import ru.mycrg.auth_service.repository.OrgInitOutboxRepository;
import ru.mycrg.auth_service.repository.OrganizationRepository;
import ru.mycrg.auth_service.repository.UserRepository;
import ru.mycrg.auth_service.service.organization.settings.OrganizationSettingService;
import ru.mycrg.auth_service.service.specialization.SpecializationService;
import ru.mycrg.auth_service_contract.AESCryptor;
import ru.mycrg.auth_service_contract.dto.OrganizationCreateDto;
import ru.mycrg.auth_service_contract.dto.UserCreateDto;
import ru.mycrg.common_contracts.specialization.Specialization;

import static ru.mycrg.auth_service.service.specialization.SpecializationMapper.mapToCompact;
import static ru.mycrg.auth_service_contract.Authorities.ORG_ADMIN;
import static ru.mycrg.common_utils.CrgGlobalProperties.prepareGeoserverLogin;

@Service
public class OrganizationInitializer {

    private final Logger log = LoggerFactory.getLogger(OrganizationInitializer.class);

    private final AESCryptor aesCryptor;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder;
    private final OrgInitOutboxRepository outboxRepository;
    private final OrganizationSettingService settingService;
    private final SpecializationService specializationService;
    private final OrganizationRepository organizationRepository;

    public OrganizationInitializer(AESCryptor aesCryptor,
                                   UserRepository userRepository,
                                   BCryptPasswordEncoder encoder,
                                   OrgInitOutboxRepository outboxRepository,
                                   OrganizationRepository organizationRepository,
                                   OrganizationSettingService settingService,
                                   SpecializationService specializationService) {
        this.encoder = encoder;
        this.aesCryptor = aesCryptor;
        this.userRepository = userRepository;
        this.settingService = settingService;
        this.outboxRepository = outboxRepository;
        this.specializationService = specializationService;
        this.organizationRepository = organizationRepository;
    }

    @Transactional
    public Long initialize(OrganizationCreateDto createDto) {
        log.debug("Инициализация организации: {}", createDto.getName());

        UserCreateDto ownerDto = createDto.getOwner();

        // Создаем пользователя
        User newUser = userRepository.save(mapDtoToUser(ownerDto));

        // Создаем организацию
        Organization newOrganization =
                new Organization(createDto.getName(), createDto.getPhone(), createDto.getDescription());
        newOrganization.addUser(newUser);

        Organization savedOrg = organizationRepository.save(newOrganization);

        Specialization specialization = null;
        if (createDto.getSpecializationId() != null) {
            specialization = specializationService.getSpecialization(createDto.getSpecializationId());
        }
        settingService.initOrgSetting(savedOrg, mapToCompact(specialization));

        // Настраиваем пользователя
        newUser.setLogin(ownerDto.getEmail());
        newUser.addAuthority(ORG_ADMIN);
        newUser.setGeoserverLogin(prepareGeoserverLogin(newUser.getEmail(), newUser.getId()));
        newUser.setEnabled(true);

        String encryptedPassword = aesCryptor.encrypt(ownerDto.getPassword());
        OrgInitOutbox outbox = new OrgInitOutbox(savedOrg.getId(), encryptedPassword, createDto.getSpecializationId());
        outboxRepository.save(outbox);

        log.debug("Организация инициализирована: orgId={}, событие сохранено в outbox", savedOrg.getId());

        return savedOrg.getId();
    }

    private User mapDtoToUser(UserCreateDto owner) {
        return new User(
                encoder.encode(owner.getPassword()),
                owner.getName(),
                owner.getSurname(),
                owner.getEmail(),
                owner.getMiddleName(),
                owner.getJob(),
                owner.getPhone(),
                owner.getBossId()
        );
    }
}
