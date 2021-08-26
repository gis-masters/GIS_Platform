package ru.mycrg.auth_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.data.rest.core.annotation.HandleBeforeSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.auth_service.dto.GroupProjection;
import ru.mycrg.auth_service.entity.Group;
import ru.mycrg.auth_service.entity.Organization;
import ru.mycrg.auth_service.entity.User;
import ru.mycrg.auth_service.exceptions.CrgValidationException;
import ru.mycrg.auth_service.exceptions.NotFoundException;
import ru.mycrg.auth_service.queue.MessageBusProducer;
import ru.mycrg.auth_service.repository.GroupRepository;
import ru.mycrg.auth_service.repository.OrganizationRepository;
import ru.mycrg.auth_service.security.IAuthenticationFacade;
import ru.mycrg.auth_service_contract.dto.GroupCreateDto;
import ru.mycrg.auth_service_contract.events.request.UserGroupDeletedEvent;

import javax.validation.ConstraintViolation;
import javax.validation.Validator;
import java.time.LocalDateTime;
import java.util.Set;

@Service
@Transactional
@RepositoryEventHandler
public class GroupService {

    private static final Logger log = LoggerFactory.getLogger(GroupService.class);

    private static final String GROUP = "Группа";
    private static final String ORGANIZATION = "Организация";

    private final Validator validator;
    private final GroupRepository groupRepository;
    private final ProjectionFactory projectionFactory;
    private final OrganizationRepository orgRepository;
    private final IAuthenticationFacade authenticationFacade;
    private final MessageBusProducer messageBus;

    public GroupService(Validator validator,
                        GroupRepository groupRepository,
                        ProjectionFactory projectionFactory,
                        IAuthenticationFacade authenticationFacade,
                        OrganizationRepository orgRepository,
                        MessageBusProducer messageBus) {
        this.validator = validator;
        this.orgRepository = orgRepository;
        this.groupRepository = groupRepository;
        this.projectionFactory = projectionFactory;
        this.authenticationFacade = authenticationFacade;
        this.messageBus = messageBus;
    }

    @HandleBeforeSave
    public void beforeSave(Group group) {
        validate(new GroupCreateDto(group.getName(), group.getDescription()));
    }

    public GroupProjection create(GroupCreateDto dto) {
        final Long orgId = authenticationFacade.getOrganizationId();

        Organization organization = orgRepository.findById(orgId)
                                                 .orElseThrow(() -> new NotFoundException(ORGANIZATION, orgId));

        Group newGroup = new Group();
        newGroup.setName(dto.getName());
        newGroup.setDescription(dto.getDescription());
        newGroup.setOrganization(organization);
        newGroup.setCreatedAt(LocalDateTime.now());
        newGroup.setLastModified(LocalDateTime.now());

        Group savedGroup = groupRepository.save(newGroup);

        return projectionFactory.createProjection(GroupProjection.class, savedGroup);
    }

    public GroupProjection findById(Long id) {
        Long orgId = authenticationFacade.getOrganizationId();
        Group byId = groupRepository
                .findByIdAndOrganizationId(id, orgId)
                .orElseThrow(() -> new NotFoundException(GROUP, id));

        return projectionFactory.createProjection(GroupProjection.class, byId);
    }

    public Page<GroupProjection> findAll(Pageable pageable) {
        Long orgId = authenticationFacade.getOrganizationId();

        return groupRepository.findByOrganizationId(orgId, pageable);
    }

    public void addUser(Long groupId, Long userId) {
        log.debug("Try add user: {} to group: {}", userId, groupId);

        Long orgId = authenticationFacade.getOrganizationId();
        Group group = groupRepository
                .findByIdAndOrganizationId(groupId, orgId)
                .orElseThrow(() -> new NotFoundException(GROUP, groupId));

        Organization organization = orgRepository
                .findById(orgId)
                .orElseThrow(() -> new NotFoundException(ORGANIZATION, orgId));

        User user = organization.getUsers().stream()
                                .filter(u -> u.getId().equals(userId))
                                .findFirst()
                                .orElseThrow(() -> new NotFoundException("Пользователь", userId));

        group.addUser(user);

        groupRepository.save(group);
    }

    public void removeUser(Long groupId, Long userId) {
        log.debug("Try delete user: {} from group: {}", userId, groupId);

        Long orgId = authenticationFacade.getOrganizationId();
        Group group = groupRepository
                .findByIdAndOrganizationId(groupId, orgId)
                .orElseThrow(() -> new NotFoundException(GROUP, groupId));

        group.removeUser(userId);
    }

    public void delete(Long groupId) {
        Group group = groupRepository
                .findByIdAndOrganizationId(groupId, authenticationFacade.getOrganizationId())
                .orElseThrow(() -> new NotFoundException(GROUP, groupId));

        groupRepository.delete(group);

        messageBus.produce(new UserGroupDeletedEvent(authenticationFacade.getAccessToken(), groupId));
    }

    private <T> void validate(T bean) {
        Set<ConstraintViolation<T>> violations = validator.validate(bean);
        if (!violations.isEmpty()) {
            throw new CrgValidationException(violations);
        }
    }
}
