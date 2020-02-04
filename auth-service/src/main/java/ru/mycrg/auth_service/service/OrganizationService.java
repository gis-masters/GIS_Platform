package ru.mycrg.auth_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service.dto.OrganizationCreateDto;
import ru.mycrg.auth_service.dto.UserCreateDto;
import ru.mycrg.auth_service.entity.Organization;
import ru.mycrg.auth_service.entity.User;
import ru.mycrg.auth_service.exeptions.ConflictException;
import ru.mycrg.auth_service.queue.MessageBus;
import ru.mycrg.auth_service.repository.OrganizationRepository;
import ru.mycrg.auth_service.repository.UserRepository;
import ru.mycrg.auth_service.security.AES;
import ru.mycrg.auth_service_contract.OrganizationInitializedEvent;

import javax.transaction.Transactional;
import javax.validation.Valid;
import java.util.Optional;

import static ru.mycrg.auth_service.config.Authorities.ORG_ADMIN;

/**
 * CRUD сервис для работы с Организациями.
 */
@Service
@Transactional
public class OrganizationService {

    private final BCryptPasswordEncoder bCrypt = new BCryptPasswordEncoder();

    private final MessageBus messageBus;
    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;

    @Autowired
    public OrganizationService(OrganizationRepository organizationRepository,
                               UserRepository userRepository,
                               MessageBus messageBus) {
        this.organizationRepository = organizationRepository;
        this.userRepository = userRepository;
        this.messageBus = messageBus;
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
        UserCreateDto owner = createDto.getOwner();
        Optional<User> userByEmail = userRepository.findByEmail(owner.getEmail());
        if (userByEmail.isPresent()) {
            throw new ConflictException("Данный email уже занят");
        }

        Organization newOrganization;

        User newUser = userRepository.save(mapDtoToUser(owner));

        newOrganization = mapDtoToOrganization(createDto);
        newOrganization.addUser(newUser);

        organizationRepository.save(newOrganization);
        // We use email as login
        newUser.setUsername(owner.getEmail());
        newUser.addAuthority(ORG_ADMIN);

        messageBus.sendOrgEvent(
                new OrganizationInitializedEvent(
                        newOrganization.getId(),
                        AES.encrypt(owner.getPassword(), owner.getEmail()),
                        owner.getEmail(),
                        newUser.getUsername()));

        return newOrganization;
    }

    private Organization mapDtoToOrganization(OrganizationCreateDto dto) {
        return new Organization(dto.getName(), dto.getPhone());
    }

    private User mapDtoToUser(UserCreateDto owner) {
        return
                new User(
                        bCrypt.encode(owner.getPassword()),
                        owner.getName(),
                        owner.getSurName(),
                        owner.getEmail()
                );
    }

}
