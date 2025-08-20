package ru.mycrg.auth_service.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.*;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.retry.annotation.Retryable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
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

import java.util.*;
import java.util.stream.Collectors;

import static java.time.LocalDateTime.now;
import static java.time.format.DateTimeFormatter.ISO_LOCAL_DATE_TIME;
import static java.util.Objects.nonNull;
import static ru.mycrg.auth_service.AuthJWTApplication.mapper;
import static ru.mycrg.auth_service_contract.Authorities.USER;
import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultRoleName;
import static ru.mycrg.common_utils.CrgGlobalProperties.prepareGeoserverLogin;

@Service
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
                                         .createdAt(user.getCreatedAt().format(ISO_LOCAL_DATE_TIME))
                                         .lastModified(user.getLastModified().format(ISO_LOCAL_DATE_TIME))
                                         .version(user.getVersion())
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
        return getByLoginIgnoreCase(login).isPresent();
    }

    public Optional<User> getByLoginIgnoreCase(String login) {
        return userRepository.findByLoginIgnoreCase(login);
    }

    /**
     * Use only this authentication context.
     */
    @Transactional
    public UserProjection create(UserCreateDto dto, Long orgId) {
        return create(dto, orgId, authenticationFacade.getAccessToken(), authenticationFacade.getLogin(), false);
    }

    // TODO: вынести retryable код в отдельный, более мелкий метод, например, "messageBus.produce" точно должен быть за
    //  "бортом". В тестах есть шаг: "Существует 30 пользователей", где в многопотоке создаются N пользователей, на нём
    //  можно оттестировать поведение.
    @Retryable
    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public UserProjection create(UserCreateDto dto, Long orgId, String accessToken, String creator, boolean enabled) {
        log.debug("'{}' create user: '{}' in organization: '{}'", creator, dto.getEmail(), orgId);

        Optional<User> userByEmail = userRepository.findByEmailIgnoreCase(dto.getEmail());
        if (userByEmail.isPresent()) {
            throw new ConflictException(String.format("Пользователь с email: %s уже существует", dto.getEmail()));
        }

        if (nonNull(dto.getBossId())) {
            Optional<User> bossUser = userRepository.findById(Long.valueOf(dto.getBossId()));
            if (bossUser.isEmpty()) {
                throw new BadRequestException("Неверно указан начальник для пользователя");
            }
        }

        Organization organization = orgRepository.findById(orgId)
                                                 .orElseThrow(() -> new NotFoundException(orgId));

        User newUser = new User(encoder.encode(dto.getPassword()),
                                dto.getName(),
                                dto.getSurname(),
                                dto.getEmail(),
                                dto.getMiddleName(),
                                dto.getJob(),
                                dto.getPhone(),
                                dto.getBossId()
        );
        newUser.setLogin(dto.getEmail());
        newUser.addAuthority(USER);
        newUser.setEnabled(enabled);
        newUser.setDepartment(dto.getDepartment());
        newUser.setVersion((short) 0);
        newUser.setCreatedBy(creator);
        newUser.setUpdatedBy(creator);

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

        messageBus.produce(new CrgAuditEvent(accessToken,
                                             "CREATE",
                                             savedUser.getEmail(),
                                             "USER",
                                             savedUser.getId(),
                                             mapper.convertValue(dto, JsonNode.class)));

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
     * Супер админ может получить пользователя любой организации. Любой пользователь может получить любого пользователя
     * из своей организации.
     *
     * @param id Идентификатор пользователя
     *
     * @throws NotFoundException если пользователь не существует
     * @throws NotFoundException если пользователя нет в этой организации
     * @see ru.mycrg.auth_service_contract.Authorities
     */
    public UserProjection findById(Long id) {
        return projectionFactory.createProjection(UserProjection.class, findOrThrow(id));
    }

    @Transactional
    public void delete(Long id) {
        UserProjection userProjection = findById(id);
        log.debug("Try delete user: {}", userProjection.getEmail());

        userRepository.findById(id).ifPresent(user -> {
            user.getOrganizations().forEach(org -> org.getUsers().remove(user));
            userRepository.deleteById(user.getId());

            messageBus.produce(
                    new UserDeletedEvent(user.getLogin(), authenticationFacade.getAccessToken(), id));

            messageBus.produce(new CrgAuditEvent(authenticationFacade.getAccessToken(),
                                                 "DELETE",
                                                 userProjection.getEmail(),
                                                 "USER",
                                                 userProjection.getId()));
        });
    }

    @Transactional
    public void invite(String email, Long orgId) {
        log.debug("Try to invite user: {} in organization: {}", email, orgId);

        User user = userRepository.findByEmailIgnoreCase(email)
                                  .orElseThrow(() -> new NotFoundException("Пользователь", email));

        Organization organization = orgRepository.findById(orgId)
                                                 .orElseThrow(() -> new NotFoundException(orgId));

        Set<User> organizationUsers = organization.getUsers();
        if (organizationUsers.contains(user)) {
            String msg = "Пользователь " + email + " уже добавлен в данную организацию!";
            log.debug(msg);

            throw new ConflictException(msg);
        } else {
            organization.addUser(user);

            messageBus.produce(
                    new CrgAuditEvent(authenticationFacade.getAccessToken(),
                                      "INVITE",
                                      email,
                                      "USER",
                                      user.getId()));

            upVersion(user);
        }
    }

    @Transactional
    public void addAuthority(Long id, String authority) {
        UserProjection userProjection = findById(id);

        if (!isUserHasAuthority(userProjection, authority)) {
            userRepository.findById(userProjection.getId()).ifPresent(user -> user.addAuthority(authority));
        }
    }

    @Transactional
    public void removeAuthority(Long id, String authority) {
        UserProjection userProjection = findById(id);

        if (isUserHasAuthority(userProjection, authority)) {
            userRepository.findById(userProjection.getId()).ifPresent(user -> user.removeAuthority(authority));
        } else {
            throw new NotFoundException(id);
        }
    }

    @Transactional
    public void update(Long userId, UserUpdateDto dto) {
        User userForUpdate = findOrThrow(userId);

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

        if (dto.getBossId() != null) {
            Optional<User> bossUser = userRepository.findById(Long.valueOf(dto.getBossId()));
            if (bossUser.isEmpty()) {
                throw new BadRequestException("Неверно указан начальник для пользователя");
            } else {
                long newBossId = dto.getBossId().longValue();
                Set<Long> usersForVersionUpdate = new HashSet<>(Arrays.asList(userId, newBossId));

                if (nonNull(userForUpdate.getBossId())) {
                    usersForVersionUpdate.add(userForUpdate.getBossId().longValue());
                }

                userForUpdate.setBossId(dto.getBossId());

                usersForVersionUpdate.addAll(fetchAllBosses(usersForVersionUpdate, newBossId, new HashMap<>()));
                usersForVersionUpdate.forEach(this::upVersion);
            }
        } else {
            if (nonNull(userForUpdate.getBossId())) {
                upVersion(userForUpdate.getBossId().longValue());
            }
            upVersion(userId);

            userForUpdate.setBossId(null);
        }

        userForUpdate.setLastModified(now());
        userForUpdate.setUpdatedBy(authenticationFacade.getLogin());

        userRepository.save(userForUpdate);

        messageBus.produce(new CrgAuditEvent(authenticationFacade.getAccessToken(),
                                             "UPDATE",
                                             userForUpdate.getEmail(),
                                             "USER", userForUpdate.getId(),
                                             mapper.convertValue(dto, JsonNode.class)));
    }

    /**
     * Use only this authentication context.
     */
    @Transactional
    public void upVersion(Long userId) {
        upVersion(findOrThrow(userId));
    }

    @Transactional
    public void upVersion(User user) {
        Short userVersion = user.getVersion();
        if (nonNull(userVersion) && userVersion < Short.MAX_VALUE) {
            userVersion = (short) (userVersion + 1);
            user.setVersion(userVersion);
        } else {
            user.setVersion((short) 0);
        }
    }

    @Transactional
    public void userUpdatedByAndLastModifiedUpdate(Long userId, String updatedBy) {
        User user = findOrThrow(userId);

        user.setUpdatedBy(updatedBy);
        user.setLastModified(now());
    }

    public Set<Long> fetchAllBosses(Set<Long> bossIds, Long userId, Map<Long, Integer> recursion) {
        Integer counter = recursion.getOrDefault(userId, 0);
        if (counter <= 3) {
            User user = findOrThrow(userId);

            if (nonNull(user.getBossId())) {
                Long currentBossId = user.getBossId().longValue();
                bossIds.add(currentBossId);

                recursion.put(userId, counter + 1);
                fetchAllBosses(bossIds, currentBossId, recursion);
            }
        } else {
            log.debug("Для пользователя {} существует подозрение на рекурсию начальника", userId);
        }

        return bossIds;
    }

    public Set<Integer> fetchDirectMinions(Long bossId) {
        return userRepository.findByBossId(bossId.intValue())
                             .stream().map(user -> user.getId().intValue())
                             .collect(Collectors.toSet());
    }

    public void fetchMinions(Set<Integer> minions, Long bossId, Map<Long, Integer> recursion) {
        Integer counter = recursion.getOrDefault(bossId, 0);
        if (counter <= 3) {
            Set<Integer> currentMinions = userRepository.findByBossId(bossId.intValue())
                                                        .stream().map(user -> user.getId().intValue())
                                                        .collect(Collectors.toSet());

            minions.addAll(currentMinions);

            recursion.put(bossId, counter + 1);
            for (Integer currentMinion: currentMinions) {
                fetchMinions(minions, currentMinion.longValue(), recursion);
            }
        } else {
            log.debug("Для пользователя {} существует подозрение на рекурсию подчинённых", bossId);
        }
    }

    private boolean isUserHasAuthority(UserProjection userProjection, String authority) {
        return userProjection.getAuthorities().stream()
                             .anyMatch(aProjection -> authority.equalsIgnoreCase(aProjection.getAuthority()));
    }

    private User findOrThrow(Long id) {
        if (authenticationFacade.isRoot()) {
            return userRepository.findById(id)
                                 .orElseThrow(() -> new NotFoundException(id));
        }

        String ownerName = authenticationFacade.getLogin();
        Long orgId = authenticationFacade.getOrganizationId();

        return userRepository
                .findByLoginIgnoreCase(ownerName)
                .orElseThrow(() -> new NotFoundException(ownerName))
                .getOrganizations().stream()
                .filter(organization -> organization.getId().equals(orgId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Не найдена организация: " + orgId))
                .getUsers().stream()
                .filter(user -> user.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new NotFoundException(id));
    }
}
