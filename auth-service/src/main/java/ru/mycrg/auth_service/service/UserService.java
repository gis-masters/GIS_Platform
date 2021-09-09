package ru.mycrg.auth_service.service;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.auth_service.dto.UserProjection;
import ru.mycrg.auth_service.entity.Authorities;
import ru.mycrg.auth_service.entity.Organization;
import ru.mycrg.auth_service.entity.User;
import ru.mycrg.auth_service.exceptions.ConflictException;
import ru.mycrg.auth_service.exceptions.NotFoundException;
import ru.mycrg.auth_service.repository.OrganizationRepository;
import ru.mycrg.auth_service.repository.UserRepository;
import ru.mycrg.auth_service.security.AuthenticationFacade;
import ru.mycrg.auth_service_contract.dto.UserCreateDto;
import ru.mycrg.auth_service_contract.dto.UserInfoModel;
import ru.mycrg.auth_service_contract.dto.UserUpdateDto;
import ru.mycrg.auth_service_contract.events.request.UserCreatedEvent;
import ru.mycrg.auth_service_contract.events.request.UserDeletedEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static ru.mycrg.auth_service_contract.Authorities.USER;

@Service
@Transactional
public class UserService {

    private final Logger log = LoggerFactory.getLogger(UserService.class);

    private final BCryptPasswordEncoder bCrypt = new BCryptPasswordEncoder();

    private final IMessageBusProducer messageBus;
    private final ProjectionFactory projectionFactory;
    private final UserRepository userRepository;
    private final OrganizationRepository orgRepository;
    private final AuthenticationFacade authenticationFacade;

    public UserService(UserRepository userRepository,
                       IMessageBusProducer messageBus,
                       OrganizationRepository orgRepository,
                       AuthenticationFacade authenticationFacade,
                       ProjectionFactory projectionFactory) {
        this.messageBus = messageBus;
        this.userRepository = userRepository;
        this.orgRepository = orgRepository;
        this.projectionFactory = projectionFactory;
        this.authenticationFacade = authenticationFacade;
    }

    @NotNull
    public UserInfoModel getCurrent(String userName) {
        User user = userRepository.findByLogin(userName)
                                  .orElseThrow(() -> new NotFoundException(userName));

        Set<Organization> organizations = user.getOrganizations();
        if (!organizations.isEmpty()) {
            Organization organization = organizations.iterator().next();

            final Set<String> authorities = user.getAuthorities().stream()
                                                .map(Authorities::getAuthority)
                                                .collect(Collectors.toSet());

            return UserInfoModel.builder()
                                .id(user.getId())
                                .name(user.getName())
                                .login(user.getLogin())
                                .surname(user.getSurname())
                                .middleName(user.getMiddleName())
                                .job(user.getJob())
                                .phone(user.getPhone())
                                .email(user.getEmail())
                                .enabled(user.isEnabled())
                                .authorities(authorities)
                                .createdAt(user.getCreatedAt())
                                .orgId(organization.getId())
                                .orgName(organization.getName())
                                .build();
        }

        return new UserInfoModel(userName);
    }

    public UserProjection create(UserCreateDto dto, Long orgId) {
        log.debug("Try create user: {} in organization: {}", dto.getEmail(), orgId);

        Optional<User> userByEmail = userRepository.findByEmail(dto.getEmail());
        if (userByEmail.isPresent()) {
            throw new ConflictException("Данный email уже занят");
        }

        Organization organization = orgRepository
                .findById(orgId)
                .orElseThrow(() -> new NotFoundException(orgId));

        User newUser = new User(bCrypt.encode(dto.getPassword()),
                                dto.getName(),
                                dto.getSurname(),
                                dto.getEmail(),
                                dto.getMiddleName(),
                                dto.getJob(),
                                dto.getPhone()
        );
        newUser.setLogin(dto.getEmail());
        newUser.addAuthority(USER);
        newUser.setEnabled(false);

        User savedUser = userRepository.save(newUser);

        organization.addUser(savedUser);

        messageBus.produce(
                new UserCreatedEvent(savedUser.getLogin(),
                                     authenticationFacade.getAccessToken(),
                                     dto.getPassword(),
                                     true,
                                     "admin_" + orgId)
        );

        return projectionFactory.createProjection(UserProjection.class, savedUser);
    }

    /**
     * Возвращает всех пользователей организации.
     *
     * @param pageable Pagination information
     */
    @NotNull
    public Page<UserProjection> findAll(Pageable pageable) {
        final Long orgId = authenticationFacade.getOrganizationId();
        final Organization organization = orgRepository
                .findById(orgId)
                .orElseThrow(() -> new NotFoundException(Organization.class, orgId));

        return userRepository.findByOrganizations(Collections.singleton(organization), pageable)
                             .map(user -> projectionFactory.createProjection(UserProjection.class, user));
    }

    /**
     * Возвращает пользователя если выполняются условия
     * <ol>
     * <li>Если запрос пришел от root
     * <li>Если запрос пришел от администратора организации и запрашиваемый является пользователем организации
     * <li>Если запрос пришел от самого пользователя
     * </ol>
     *
     * @param id Идентификатор пользователя
     *
     * @throws NotFoundException если пользователь не существует
     * @throws NotFoundException если нет прав на просмотр пользователя
     * @see ru.mycrg.auth_service_contract.Authorities
     */
    public UserProjection findProjectionById(Long id) {
        User user = findById(id).orElseThrow(() -> new NotFoundException(id));

        return projectionFactory.createProjection(UserProjection.class, user);
    }

    public void delete(Long id) {
        UserProjection userProjection = findProjectionById(id);
        log.debug("Try delete user: {}", userProjection.getEmail());

        userRepository.findById(id).ifPresent(user -> {
            user.getOrganizations().forEach(org -> org.getUsers().remove(user));
            userRepository.deleteById(user.getId());

            messageBus.produce(
                    new UserDeletedEvent(user.getLogin(), authenticationFacade.getAccessToken(), id));
        });
    }

    public void addAuthority(Long id, String authority) {
        UserProjection userProjection = findProjectionById(id);

        if (!isUserHasAuthority(userProjection, authority)) {
            userRepository.findById(userProjection.getId()).ifPresent(user -> user.addAuthority(authority));
        }
    }

    public void removeAuthority(Long id, String authority) {
        UserProjection userProjection = findProjectionById(id);

        if (isUserHasAuthority(userProjection, authority)) {
            userRepository.findById(userProjection.getId()).ifPresent(user -> user.removeAuthority(authority));
        } else {
            throw new NotFoundException(id);
        }
    }

    public void update(Long userId, UserUpdateDto dto) {
        User userForUpdate = findById(userId).orElseThrow(() -> new NotFoundException(userId));

        if (dto.getName() != null) {
            userForUpdate.setName(dto.getName());
        }

        if (dto.getSurname() != null) {
            userForUpdate.setSurname(dto.getSurname());
        }

        if (dto.getMiddleName() != null) {
            userForUpdate.setMiddleName(dto.getMiddleName());
        }

        if (dto.getJob() != null) {
            userForUpdate.setJob(dto.getJob());
        }

        if (dto.getPhone() != null) {
            userForUpdate.setPhone(dto.getPhone());
        }

        if (dto.getPassword() != null) {
            userForUpdate.setPassword(bCrypt.encode(dto.getPassword()));
        }

        if (dto.isEnabled() != null) {
            userForUpdate.setEnabled(Boolean.parseBoolean(dto.isEnabled()));
        }

        userForUpdate.setLastModified(LocalDateTime.now());

        userRepository.save(userForUpdate);
    }

    private boolean isUserHasAuthority(UserProjection userProjection, String authority) {
        return userProjection
                .getAuthorities().stream()
                .anyMatch(aProjection -> authority.equalsIgnoreCase(aProjection.getAuthority()));
    }

    private Optional<User> findById(Long id) {
        Optional<User> oUser = Optional.empty();

        if (authenticationFacade.isRoot()) {
            oUser = userRepository.findById(id);
        } else if (authenticationFacade.isOrganizationAdmin()) {
            String ownerName = authenticationFacade.getLogin();

            User owner = userRepository.findByLogin(ownerName)
                                       .orElseThrow(() -> new NotFoundException(ownerName));

            Set<Organization> organizations = owner.getOrganizations();
            Organization organization = organizations.iterator().next();

            oUser = organization
                    .getUsers().stream()
                    .filter(u -> u.getId().equals(id))
                    .findFirst();
        } else {
            Optional<User> someUser = userRepository.findById(id);
            if (someUser.isPresent() && authenticationFacade.getLogin().equals(someUser.get().getEmail())) {
                oUser = someUser;
            }
        }

        return oUser;
    }
}
