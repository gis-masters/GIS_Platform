package ru.mycrg.auth_service.service;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.*;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.auth_service.dao.UserDao;
import ru.mycrg.auth_service.dto.UserProjection;
import ru.mycrg.auth_service.entity.Authorities;
import ru.mycrg.auth_service.entity.Organization;
import ru.mycrg.auth_service.entity.User;
import ru.mycrg.auth_service.exceptions.AuthServiceException;
import ru.mycrg.auth_service.exceptions.BadRequestException;
import ru.mycrg.auth_service.exceptions.ConflictException;
import ru.mycrg.auth_service.exceptions.NotFoundException;
import ru.mycrg.auth_service.repository.OrganizationRepository;
import ru.mycrg.auth_service.repository.UserRepository;
import ru.mycrg.auth_service_contract.dto.UserCreateDto;
import ru.mycrg.auth_service_contract.dto.UserInfoModel;
import ru.mycrg.auth_service_contract.dto.UserUpdateDto;
import ru.mycrg.auth_service_contract.events.request.UserCreatedEvent;
import ru.mycrg.auth_service_contract.events.request.UserDeletedEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static java.util.Objects.nonNull;
import static ru.mycrg.auth_service_contract.Authorities.USER;
import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultRoleName;
import static ru.mycrg.common_utils.CrgGlobalProperties.prepareGeoserverLogin;

@Service
@Transactional
public class UserService {

    private final Logger log = LoggerFactory.getLogger(UserService.class);

    private final BCryptPasswordEncoder encoder;
    private final UserRepository userRepository;
    private final IMessageBusProducer messageBus;
    private final ProjectionFactory projectionFactory;
    private final OrganizationRepository orgRepository;
    private final IAuthenticationFacade authenticationFacade;
    private final UserDao userDao;

    public UserService(UserRepository userRepository,
                       IMessageBusProducer messageBus,
                       OrganizationRepository orgRepository,
                       IAuthenticationFacade authenticationFacade,
                       ProjectionFactory projectionFactory,
                       BCryptPasswordEncoder encoder,
                       UserDao userDao) {
        this.messageBus = messageBus;
        this.userRepository = userRepository;
        this.orgRepository = orgRepository;
        this.projectionFactory = projectionFactory;
        this.authenticationFacade = authenticationFacade;
        this.encoder = encoder;
        this.userDao = userDao;
    }

    @NotNull
    public UserInfoModel getByLogin(String login) {
        User user = userRepository.findByLoginIgnoreCase(login)
                                  .orElseThrow(() -> new NotFoundException(login));

        Set<String> authorities = user.getAuthorities().stream()
                                      .map(Authorities::getAuthority)
                                      .collect(Collectors.toSet());

        UserInfoModel dto = UserInfoModel.builder()
                                         .id(user.getId())
                                         .name(user.getName())
                                         .login(user.getLogin())
                                         .geoserverLogin(user.getGeoserverLogin())
                                         .surname(user.getSurname())
                                         .middleName(user.getMiddleName())
                                         .job(user.getJob())
                                         .phone(user.getPhone())
                                         .email(user.getEmail())
                                         .enabled(user.isEnabled())
                                         .authorities(authorities)
                                         .createdAt(user.getCreatedAt())
                                         .build();

        if (!authenticationFacade.isRoot()) {
            Long orgId = authenticationFacade.getOrganizationId();
            Set<Organization> organizations = user.getOrganizations();
            Optional<Organization> orgById = organizations.stream()
                                                          .filter(organization -> orgId.equals(organization.getId()))
                                                          .findFirst();
            if (orgById.isEmpty()) {
                throw new AuthServiceException("Не удалось найти организацию по id: " + orgId);
            }

            Organization organization = orgById.get();
            dto.setOrgId(organization.getId());
            dto.setOrgName(organization.getName());
        }

        return dto;
    }

    public boolean isExist(String login) {
        return userRepository.findByLoginIgnoreCase(login).isPresent();
    }

    public UserProjection create(UserCreateDto dto, Long orgId, String accessToken) {
        log.debug("Try create user: {} in organization: {}", dto.getEmail(), orgId);

        Optional<User> userByEmail = userRepository.findByEmail(dto.getEmail());
        if (userByEmail.isPresent()) {
            throw new ConflictException("Данный email уже занят");
        }

        Organization organization = orgRepository.findById(orgId)
                                                 .orElseThrow(() -> new NotFoundException(orgId));

        User newUser = new User(encoder.encode(dto.getPassword()),
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
        newUser.setDepartment(dto.getDepartment());

        User savedUser = userRepository.save(newUser);
        savedUser.setGeoserverLogin(prepareGeoserverLogin(savedUser.getLogin(), savedUser.getId()));

        organization.addUser(savedUser);

        messageBus.produce(
                new UserCreatedEvent(savedUser.getGeoserverLogin(),
                                     savedUser.getLogin(),
                                     accessToken,
                                     dto.getPassword(),
                                     true,
                                     getDefaultRoleName(orgId))
        );

        return projectionFactory.createProjection(UserProjection.class, savedUser);
    }

    /**
     * Возвращает всех пользователей организации.
     *
     * @param pageable Pagination information
     */
    @NotNull
    public Page<UserProjection> findAll(String ecqlFilter, Pageable pageable) {
        Long orgId = authenticationFacade.getOrganizationId();

        Sort defaultSort = Sort.by("id").ascending();
        if (pageable.getSort().isUnsorted()) {
            pageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), defaultSort);
        }

        List<User> users;
        try {
            users = userDao.findAll(ecqlFilter, pageable, orgId);
        } catch (BadSqlGrammarException ex) {
            String message = "Не удалось выполнить запрос на выборку пользователей. ";
            if (nonNull(ex.getCause()) && nonNull(ex.getCause().getMessage())) {
                message += "Причина: " + ex.getCause().getMessage();
            }
            log.error(message);

            throw new BadRequestException(message);
        }

        List<UserProjection> usersProjection = users
                .stream()
                .map(user -> projectionFactory.createProjection(UserProjection.class, user))
                .collect(Collectors.toList());

        long totalUsers = userDao.getTotal(ecqlFilter, orgId);

        return new PageImpl<>(usersProjection, pageable, totalUsers);
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

    public void invite(String email, String accessToken, Long orgId) {
        log.debug("Try to invite user: {} in organization: {}", email, orgId);

        User userFromDB = userRepository.findByEmail(email)
                                        .orElseThrow(() -> new NotFoundException("Пользователь", email));

        Organization organization = orgRepository.findById(orgId)
                                                 .orElseThrow(() -> new NotFoundException(orgId));

        Set<User> organizationUsers = organization.getUsers();
        if (organizationUsers.contains(userFromDB)) {
            String msg = "Пользователь " + email + " уже добавлен в данную организацию!";
            log.debug(msg);

            throw new ConflictException(msg);
        } else {
            organization.addUser(userFromDB);

            messageBus.produce(
                    new CrgAuditEvent(accessToken, "INVITE", email, "USER", userFromDB.getId()));
        }
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
            userForUpdate.setPassword(encoder.encode(dto.getPassword()));
        }

        if (dto.isEnabled() != null) {
            userForUpdate.setEnabled(Boolean.parseBoolean(dto.isEnabled()));
        }

        if (dto.getDepartment() != null) {
            userForUpdate.setDepartment(dto.getDepartment());
        }

        userForUpdate.setLastModified(LocalDateTime.now());

        userRepository.save(userForUpdate);
    }

    private boolean isUserHasAuthority(UserProjection userProjection, String authority) {
        return userProjection.getAuthorities().stream()
                             .anyMatch(aProjection -> authority.equalsIgnoreCase(aProjection.getAuthority()));
    }

    private Optional<User> findById(Long id) {
        Optional<User> oUser = Optional.empty();

        if (authenticationFacade.isRoot()) {
            oUser = userRepository.findById(id);
        } else if (authenticationFacade.isOrganizationAdmin()) {
            String ownerName = authenticationFacade.getLogin();

            User owner = userRepository.findByLoginIgnoreCase(ownerName)
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
