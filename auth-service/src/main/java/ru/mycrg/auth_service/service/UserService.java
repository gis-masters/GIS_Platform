package ru.mycrg.auth_service.service;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.auth_service.dto.UserProjection;
import ru.mycrg.auth_service.entity.Authorities;
import ru.mycrg.auth_service.entity.Organization;
import ru.mycrg.auth_service.entity.User;
import ru.mycrg.auth_service.exeptions.ConflictException;
import ru.mycrg.auth_service.exeptions.NotFoundException;
import ru.mycrg.auth_service.queue.MessageBus;
import ru.mycrg.auth_service.repository.OrganizationRepository;
import ru.mycrg.auth_service.repository.UserRepository;
import ru.mycrg.auth_service_contract.UserCreatedEvent;
import ru.mycrg.auth_service_contract.UserDeletedEvent;
import ru.mycrg.auth_service_contract.dto.UserCreateDto;
import ru.mycrg.auth_service_contract.dto.UserInfoModel;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static ru.mycrg.auth_service.security.CrgClaimsParser.*;
import static ru.mycrg.auth_service.service.AuthorityService.USER;

@Service
@Transactional
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final BCryptPasswordEncoder bCrypt = new BCryptPasswordEncoder();

    private final MessageBus messageBus;
    private final ProjectionFactory projectionFactory;
    private final UserRepository userRepository;
    private final OrganizationRepository orgRepository;

    public UserService(UserRepository userRepository,
                       MessageBus messageBus,
                       OrganizationRepository orgRepository,
                       ProjectionFactory projectionFactory) {
        this.messageBus = messageBus;
        this.userRepository = userRepository;
        this.orgRepository = orgRepository;
        this.projectionFactory = projectionFactory;
    }

    @NotNull
    public UserInfoModel getCurrent(String userName) {
        User user = userRepository.findByUsername(userName)
                                  .orElseThrow(() -> new NotFoundException(userName));

        Set<Organization> organizations = user.getOrganizations();
        if (!organizations.isEmpty()) {
            Organization organization = organizations.iterator().next();

            final List<String> roles = user.getAuthorities().stream()
                                           .map(Authorities::getAuthority)
                                           .collect(Collectors.toList());

            return new UserInfoModel(userName, organization.getName(), organization.getId(), roles);
        }

        return new UserInfoModel(userName);
    }

    public UserProjection create(UserCreateDto dto, Long orgId, Authentication authentication) {
        log.debug("Try create user: {} in organization: {}", dto.getEmail(), orgId);

        Optional<User> userByEmail = userRepository.findByEmail(dto.getEmail());
        if (userByEmail.isPresent()) {
            throw new ConflictException("Данный email уже занят");
        }

        Organization organization = orgRepository
                .findById(orgId)
                .orElseThrow(() -> new NotFoundException(orgId));

        User newUser = new User(
                bCrypt.encode(dto.getPassword()),
                dto.getName(),
                dto.getSurName(),
                dto.getEmail()
        );
        newUser.setUsername(dto.getEmail());
        newUser.addAuthority(USER);
        newUser.setEnabled(true);

        User savedUser = userRepository.save(newUser);

        organization.addUser(savedUser);

        messageBus.sendUserEvent(
                new UserCreatedEvent(
                        savedUser.getUsername(),
                        getToken(authentication),
                        dto.getPassword(),
                        true,
                        "admin_" + orgId)
        );

        return projectionFactory.createProjection(UserProjection.class, savedUser);
    }

    /**
     * Возвращает всех пользователей если запрос пришел от root пользователя либо всех пользователей организации,
     * владелец которой запрашивает даные.
     *
     * @param pageable       Pagination information
     * @param authentication Authenticated principal info
     */
    @NotNull
    public Page<UserProjection> findAll(Pageable pageable, Authentication authentication) {
        Page<User> users = new PageImpl<>(new ArrayList<>(), pageable, 0);
        if (isRoot(authentication)) {
            users = userRepository.findAll(pageable);
        } else if (isGeoserverAdmin(authentication)) {
            String ownerName = authentication.getName();

            User owner = userRepository.findByUsername(ownerName)
                                       .orElseThrow(() -> new NotFoundException(ownerName));

            Set<Organization> organizations = owner.getOrganizations();
            if (!organizations.isEmpty()) {
                users = userRepository.findByOrganizations(organizations, pageable);
            } else {
                users = new PageImpl<>(new ArrayList<>(), pageable, 0);
            }
        }

        return users.map(user -> projectionFactory.createProjection(UserProjection.class, user));
    }

    /**
     * Возвращает пользователя если запрос пришел от root пользователя или запрашиваемый пользователь состоит в
     * организации, владелец которой запрашивает данные. Метод вызывает NotFoundException в случае отсутствия
     * пользователя или доступа к пользователю.
     *
     * @param id             User id
     * @param authentication Authenticated principal info
     */
    public UserProjection findById(Long id, Authentication authentication) {
        Optional<User> oUser = Optional.empty();
        if (isRoot(authentication)) {
            oUser = userRepository.findById(id);
        } else if (isGeoserverAdmin(authentication)) {
            String ownerName = authentication.getName();

            User owner = userRepository
                    .findByUsername(ownerName)
                    .orElseThrow(() -> new NotFoundException(ownerName));

            Set<Organization> organizations = owner.getOrganizations();
            Organization organization = organizations.iterator().next();

            oUser = organization
                    .getUsers().stream()
                    .filter(u -> u.getId().equals(id)).findFirst();
        }

        if (oUser.isPresent()) {
            return projectionFactory.createProjection(UserProjection.class, oUser.get());
        } else {
            throw new NotFoundException(id);
        }
    }

    public void delete(Long id, Authentication authentication) {
        UserProjection userProjection = findById(id, authentication);
        log.debug("Try delete user: {}", userProjection.getEmail());

        userRepository.findById(id).ifPresent(user -> {
            messageBus.sendUserEvent(
                    new UserDeletedEvent(user.getUsername(), getToken(authentication)));

            user.getOrganizations().forEach(org -> org.getUsers().remove(user));
            userRepository.deleteById(user.getId());
        });
    }

    public void addAuthority(Long id, String authority, Authentication authentication) {
        UserProjection userProjection = findById(id, authentication);

        if (!isUserHasAuthority(userProjection, authority)) {
            userRepository.findById(userProjection.getId()).ifPresent(user -> user.addAuthority(authority));
        }
    }

    public void removeAuthority(Long id, String authority, Authentication authentication) {
        UserProjection userProjection = findById(id, authentication);

        if (isUserHasAuthority(userProjection, authority)) {
            userRepository.findById(userProjection.getId()).ifPresent(user -> user.removeAuthority(authority));
        } else {
            throw new NotFoundException(id);
        }
    }

    private boolean isUserHasAuthority(UserProjection userProjection, String authority) {
        return userProjection
                .getAuthorities().stream()
                .anyMatch(aProjection -> authority.equalsIgnoreCase(aProjection.getAuthority()));
    }
}
