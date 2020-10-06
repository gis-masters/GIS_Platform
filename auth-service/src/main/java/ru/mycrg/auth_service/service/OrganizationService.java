package ru.mycrg.auth_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service.dto.OrganizationFullProjection;
import ru.mycrg.auth_service.entity.Organization;
import ru.mycrg.auth_service.entity.User;
import ru.mycrg.auth_service.exeptions.*;
import ru.mycrg.auth_service.queue.MessageBus;
import ru.mycrg.auth_service.repository.OrganizationRepository;
import ru.mycrg.auth_service.repository.UserRepository;
import ru.mycrg.auth_service.security.AES;
import ru.mycrg.auth_service_contract.OrganizationInitializedEvent;
import ru.mycrg.auth_service_contract.OrganizationRemovedEvent;
import ru.mycrg.auth_service_contract.dto.OrganizationCreateDto;
import ru.mycrg.auth_service_contract.dto.UserCreateDto;
import ru.mycrg.oauth_client.OAuthClient;

import javax.transaction.Transactional;
import javax.validation.Valid;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static ru.mycrg.auth_service.security.CrgClaimsParser.*;
import static ru.mycrg.auth_service.service.AuthorityService.ORG_ADMIN;
import static ru.mycrg.auth_service.service.OrganizationStatus.DELETING;
import static ru.mycrg.auth_service.service.OrganizationStatus.PROVISIONED;

@Service
@Transactional
public class OrganizationService {

    private final BCryptPasswordEncoder bCrypt = new BCryptPasswordEncoder();

    private final MessageBus messageBus;
    private final Environment environment;
    private final OAuthClient oAuthClient;
    private final UserRepository userRepository;
    private final ProjectionFactory projectionFactory;
    private final OrganizationRepository organizationRepository;

    @Autowired
    public OrganizationService(OrganizationRepository organizationRepository,
                               UserRepository userRepository,
                               MessageBus messageBus,
                               Environment environment,
                               ProjectionFactory projectionFactory,
                               OAuthClient oAuthClient) {
        this.organizationRepository = organizationRepository;
        this.projectionFactory = projectionFactory;
        this.userRepository = userRepository;
        this.messageBus = messageBus;
        this.environment = environment;
        this.oAuthClient = oAuthClient;
    }

    /**
     * Создание организации.
     * <p>
     * Вместе с организацией создается первоначальный пользователь (супер админ).
     *
     * @param createDto {@link OrganizationCreateDto}
     * @return {@link Organization}
     */
    public Organization create(@Valid OrganizationCreateDto createDto) {
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
                new OrganizationInitializedEvent(newOrganization.getId(), getRootAccessToken(),
                        AES.encrypt(owner.getPassword(), owner.getEmail()),
                        owner.getEmail(),
                        newUser.getUsername()));

        return newOrganization;
    }

    public OrganizationFullProjection findById(Long orgId, Authentication authentication) {
        return projectionFactory
                .createProjection(OrganizationFullProjection.class, getById(orgId, authentication));
    }

    public void delete(Long orgId, Authentication authentication) {
        final Organization organization = getById(orgId, authentication);
        if (!PROVISIONED.toString().equals(organization.getStatus())) {
            throw new BadRequestException("The organization: " + orgId + ", is being processed");
        }

        organization.setStatus(DELETING.toString());
        organizationRepository.save(organization);

        final List<String> owners = organization.getUsers().stream()
                .filter(User::isOwner)
                .map(User::getUsername)
                .collect(Collectors.toList());

        messageBus.sendOrgEvent(
                new OrganizationRemovedEvent(orgId, getToken(authentication), owners));
    }

    private Organization getById(Long id, Authentication authentication) {
        if (isRoot(authentication) || id.equals(getOrganizationId(authentication))) {
            return organizationRepository
                    .findById(id)
                    .orElseThrow(() -> new NotFoundException(id));
        } else {
            throw new ForbiddenException("Not allowed");
        }
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

    private String getRootAccessToken() {
        String rootUserName = environment.getRequiredProperty("crg-options.root-user-name");
        String rootUserPass = environment.getRequiredProperty("crg-options.root-user-password");

        return oAuthClient.getToken(rootUserName, rootUserPass)
                .orElseThrow(() -> new AuthServiceException("Error get root token"))
                .getAccess_token();
    }
}
