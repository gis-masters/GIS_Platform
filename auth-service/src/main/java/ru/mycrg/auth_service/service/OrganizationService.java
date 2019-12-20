package ru.mycrg.auth_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service.dto.OrganizationCreateDto;
import ru.mycrg.auth_service.entity.Organization;
import ru.mycrg.auth_service.entity.User;
import ru.mycrg.auth_service.exeptions.ConflictException;
import ru.mycrg.auth_service.exeptions.NotFoundException;
import ru.mycrg.auth_service.queue.MqSender;
import ru.mycrg.auth_service.repository.OrganizationRepository;
import ru.mycrg.auth_service.repository.UserRepository;
import ru.mycrg.auth_service.security.AES;
import ru.mycrg.auth_service_contract.OrganizationInitializedEvent;

import javax.transaction.Transactional;
import javax.validation.Valid;
import java.util.Optional;

/**
 * CRUD сервис для работы с Организациями.
 */
@Service
@Transactional
public class OrganizationService {

    private static Logger log = LoggerFactory.getLogger(OrganizationService.class);

    private final MqSender mqSender;
    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;

    @Autowired
    public OrganizationService(OrganizationRepository organizationRepository,
                               UserRepository userRepository,
                               MqSender mqSender) {
        this.organizationRepository = organizationRepository;
        this.userRepository = userRepository;
        this.mqSender = mqSender;
    }

    /**
     * Вернет сущность
     *
     * @param id Идентификатор
     * @return {@link Organization}
     */
    public Organization findById(Long id) {
        return organizationRepository
                .findById(id)
                .orElseThrow(() -> new NotFoundException("Not found organization by id: " + id));
    }

    public Page<Organization> findAll(Pageable pageable) {
        return organizationRepository.findAll(pageable);
    }

    /**
     * Создание организации.
     * <p>
     * Вместе с организацией создается первоначальный пользователь (супер админ).
     *
     * @param createDto {@link OrganizationCreateDto}
     * @return {@link Organization}
     */
    public Organization createOrg(@Valid OrganizationCreateDto createDto) {
        Optional<User> userByEmail = userRepository.findByEmail(createDto.getEmail());
        if (userByEmail.isPresent()) {
            throw new ConflictException("Данный email уже занят");
        }

        Organization newOrganization;

        User newUser = userRepository.save(mapDtoToUser(createDto));

        newOrganization = mapDtoToOrganization(createDto);
        newOrganization.addUser(newUser);

        organizationRepository.save(newOrganization);
        // We use email as login
        newUser.setUsername(createDto.getEmail());
        newUser.addAuthority("GEOSERVER_ADMIN");

        mqSender.send(
                new OrganizationInitializedEvent(
                        newOrganization.getId(),
                        AES.encrypt(createDto.getPassword(), createDto.getEmail()),
                        createDto.getEmail(),
                        newUser.getUsername()));

        return newOrganization;
    }

    private Organization mapDtoToOrganization(OrganizationCreateDto dto) {
        return new Organization(dto.getName(), dto.getPhone());
    }

    private User mapDtoToUser(OrganizationCreateDto dto) {
        BCryptPasswordEncoder bCrypt = new BCryptPasswordEncoder();

        return
                new User(
                        bCrypt.encode(dto.getPassword()),
                        dto.getUserName(),
                        dto.getUserSurName(),
                        dto.getEmail()
                );
    }

}
