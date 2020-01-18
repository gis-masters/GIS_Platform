package ru.mycrg.auth_service.service;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.auth_service.dto.UserCreateDto;
import ru.mycrg.auth_service.entity.Organization;
import ru.mycrg.auth_service.entity.User;
import ru.mycrg.auth_service.exeptions.ConflictException;
import ru.mycrg.auth_service.exeptions.NotFoundException;
import ru.mycrg.auth_service.queue.MessageBus;
import ru.mycrg.auth_service.repository.OrganizationRepository;
import ru.mycrg.auth_service.repository.UserRepository;
import ru.mycrg.auth_service_contract.UserCreatedEvent;
import ru.mycrg.auth_service_contract.UserDeletedEvent;
import ru.mycrg.auth_service_contract.dto.UserInfoModel;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static ru.mycrg.auth_service.security.CrgClaimsParser.isGeoserverAdmin;
import static ru.mycrg.auth_service.security.CrgClaimsParser.isRoot;

@Service
@Transactional
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final BCryptPasswordEncoder bCrypt = new BCryptPasswordEncoder();

    private final MessageBus messageBus;
    private final UserRepository userRepository;
    private final OrganizationRepository orgRepository;

    public UserService(UserRepository userRepository, MessageBus messageBus, OrganizationRepository orgRepository) {
        this.messageBus = messageBus;
        this.userRepository = userRepository;
        this.orgRepository = orgRepository;
    }

    @NotNull
    public UserInfoModel getCurrent(String userName) {
        User user = userRepository
                .findByUsername(userName)
                .orElseThrow(() -> new NotFoundException("Not found user: " + userName));

        Set<Organization> organizations = user.getOrganizations();
        if (!organizations.isEmpty()) {
            Organization organization = organizations.iterator().next();

            return new UserInfoModel(userName, organization.getName(), organization.getId());
        }

        return new UserInfoModel(userName);
    }

    public User create(UserCreateDto dto, Long orgId) {
        log.debug("Try create user: {} in organization: {}", dto.getEmail(), orgId);

        Optional<User> userByEmail = userRepository.findByEmail(dto.getEmail());
        if (userByEmail.isPresent()) {
            throw new ConflictException("Данный email уже занят");
        }

        Organization organization = orgRepository
                .findById(orgId)
                .orElseThrow(() -> new NotFoundException("Не найдена организация"));

        User newUser = new User(
                bCrypt.encode(dto.getPassword()),
                dto.getName(),
                dto.getSurName(),
                dto.getEmail()
        );
        newUser.setUsername(dto.getEmail());
        newUser.addAuthority("VIEWER");
        newUser.setEnabled(true);

        User savedUser = userRepository.save(newUser);

        organization.addUser(savedUser);

        messageBus.sendUserEvent(
                new UserCreatedEvent(
                        savedUser.getUsername(),
                        dto.getPassword(),
                        true)
        );

        return savedUser;
    }

    /**
     * Возвращает всех пользователей если запрос пришел от root пользователя либо всех пользователей организации,
     * владелец которой запрашивает даные.
     *
     * @param pageable       Pagination information
     * @param authentication Authenticated principal info
     */
    @NotNull
    public Page<User> findAll(Pageable pageable, Authentication authentication) {
        if (isRoot(authentication)) {
            return userRepository.findAll(pageable);
        } else if (isGeoserverAdmin(authentication)) {
            String ownerName = authentication.getName();

            User owner = userRepository
                    .findByUsername(ownerName)
                    .orElseThrow(() -> new NotFoundException("Пользователь не найден"));

            Set<Organization> organizations = owner.getOrganizations();
            if (!organizations.isEmpty()) {
                Organization organization = organizations.iterator().next();
                List<User> organizationUsers = new ArrayList<>(organization.getUsers());

                return new PageImpl<>(organizationUsers, pageable, organizationUsers.size());
            } else {
                return new PageImpl<>(new ArrayList<>(), pageable, 0);
            }
        } else {
            return new PageImpl<>(new ArrayList<>(), pageable, 0);
        }
    }

    /**
     * Возвращает пользователя если запрос пришел от root пользователя или запрашиваемый пользователь состоит в
     * организации, владелец которой запрашивает данные.
     * Метод вызывает NotFoundException в случае отсутствия пользователя или доступа к пользователю.
     *
     * @param id             User id
     * @param authentication Authenticated principal info
     */
    public User findById(Long id, Authentication authentication) {
        if (isRoot(authentication)) {
            return userRepository
                    .findById(id)
                    .orElseThrow(() -> new NotFoundException("Пользователь не найден"));
        } else if (isGeoserverAdmin(authentication)) {
            String ownerName = authentication.getName();

            User owner = userRepository
                    .findByUsername(ownerName)
                    .orElseThrow(() -> new NotFoundException("Пользователь не найден"));

            Set<Organization> organizations = owner.getOrganizations();
            Organization organization = organizations.iterator().next();

            return organization
                    .getUsers().stream()
                    .filter(user -> user.getId().equals(id)).findFirst()
                    .orElseThrow(() -> new NotFoundException("Пользователь не найден"));
        } else {
            throw new NotFoundException("Пользователь не найден");
        }
    }

    public void delete(Long id, Authentication authentication) {
        User user = findById(id, authentication);

        log.debug("Try delete user: {}", user.getEmail());

        messageBus.sendUserEvent(new UserDeletedEvent(user.getUsername()));

        userRepository.delete(user);
    }

}
