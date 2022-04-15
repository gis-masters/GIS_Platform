package ru.mycrg.auth_service.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service.dto.OrganizationFullProjection;
import ru.mycrg.auth_service.entity.Organization;
import ru.mycrg.auth_service.entity.User;
import ru.mycrg.auth_service.exceptions.BadRequestException;
import ru.mycrg.auth_service.exceptions.ConflictException;
import ru.mycrg.auth_service.exceptions.ForbiddenException;
import ru.mycrg.auth_service.exceptions.NotFoundException;
import ru.mycrg.auth_service.repository.OrganizationRepository;
import ru.mycrg.auth_service.repository.UserRepository;
import ru.mycrg.auth_service.security.IAuthenticationFacade;
import ru.mycrg.auth_service_contract.AESCryptor;
import ru.mycrg.auth_service_contract.dto.OrganizationCreateDto;
import ru.mycrg.auth_service_contract.dto.UserCreateDto;
import ru.mycrg.auth_service_contract.events.request.OrganizationInitializedEvent;
import ru.mycrg.auth_service_contract.events.request.OrganizationRemovedEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import javax.transaction.Transactional;
import javax.validation.Valid;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.vladmihalcea.hibernate.type.json.internal.JacksonUtil.toJsonNode;
import static ru.mycrg.auth_service.service.OrganizationStatus.DELETING;
import static ru.mycrg.auth_service.service.OrganizationStatus.PROVISIONED;
import static ru.mycrg.auth_service_contract.Authorities.ORG_ADMIN;

@Service
@Transactional
public class OrganizationService {

    private final BCryptPasswordEncoder bCrypt = new BCryptPasswordEncoder();

    private final AESCryptor aesCryptor;
    private final AuthService authService;
    private final UserRepository userRepository;
    private final IMessageBusProducer messageBus;
    private final ProjectionFactory projectionFactory;
    private final OrganizationRepository organizationRepository;
    private final IAuthenticationFacade authenticationFacade;

    @Autowired
    public OrganizationService(OrganizationRepository organizationRepository,
                               UserRepository userRepository,
                               IMessageBusProducer messageBus,
                               ProjectionFactory projectionFactory,
                               IAuthenticationFacade authenticationFacade,
                               AESCryptor aesCryptor,
                               AuthService authService) {
        this.organizationRepository = organizationRepository;
        this.authenticationFacade = authenticationFacade;
        this.projectionFactory = projectionFactory;
        this.userRepository = userRepository;
        this.messageBus = messageBus;
        this.aesCryptor = aesCryptor;
        this.authService = authService;
    }

    /**
     * Создание организации.
     * <p>
     * Вместе с организацией создается первоначальный пользователь (супер админ).
     *
     * @param createDto {@link OrganizationCreateDto}
     *
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
        newUser.setLogin(owner.getEmail());
        newUser.addAuthority(ORG_ADMIN);

        messageBus.produce(
                new OrganizationInitializedEvent(newOrganization.getId(),
                                                 authService.getRootAccessToken(),
                                                 aesCryptor.encrypt(owner.getPassword()),
                                                 owner.getEmail(),
                                                 newUser.getLogin()));

        return newOrganization;
    }

    public OrganizationFullProjection findById(Long orgId) {
        return projectionFactory.createProjection(OrganizationFullProjection.class, getById(orgId));
    }

    public void updateSettings(Long id, String jsonSettings) {
        Organization organization = getById(id);
        organization.setSettings(toJsonNode(jsonSettings));

        organizationRepository.save(organization);
    }

    public void delete(Long orgId) {
        final Organization organization = getById(orgId);
        if (!PROVISIONED.toString().equals(organization.getStatus())) {
            throw new BadRequestException("The organization: " + orgId + ", is being processed");
        }

        organization.setStatus(DELETING.toString());
        organizationRepository.save(organization);

        final List<String> owners = organization.getUsers().stream()
                                                .filter(User::isOwner)
                                                .map(User::getLogin)
                                                .collect(Collectors.toList());

        messageBus.produce(
                new OrganizationRemovedEvent(orgId, authenticationFacade.getAccessToken(), owners));
    }

    public JsonNode getSetting(Long id) {
        if (!id.equals(authenticationFacade.getOrganizationId())) {
            throw new ForbiddenException("Not allowed");
        }

        return organizationRepository.findById(id)
                                     .orElseThrow(() -> new NotFoundException(id))
                                     .getSettings();
    }

    private Organization getById(Long id) {
        if (authenticationFacade.isRoot() || id.equals(authenticationFacade.getOrganizationId())) {
            return organizationRepository.findById(id)
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
                        owner.getSurname(),
                        owner.getEmail(),
                        owner.getMiddleName(),
                        owner.getJob(),
                        owner.getPhone()
                );
    }
}
