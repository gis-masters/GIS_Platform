package ru.mycrg.auth_service.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.data.rest.core.annotation.HandleBeforeSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.auth_service.dto.GroupProjection;
import ru.mycrg.auth_service.entity.Group;
import ru.mycrg.auth_service.entity.Organization;
import ru.mycrg.auth_service.entity.User;
import ru.mycrg.auth_service.exceptions.BadRequestException;
import ru.mycrg.auth_service.exceptions.CrgValidationException;
import ru.mycrg.auth_service.exceptions.NotFoundException;
import ru.mycrg.auth_service.queue.MessageBusProducer;
import ru.mycrg.auth_service.repository.GroupRepository;
import ru.mycrg.auth_service.repository.OrganizationRepository;
import ru.mycrg.auth_service_contract.dto.GroupCreateDto;
import ru.mycrg.auth_service_contract.dto.GroupUpdateDto;
import ru.mycrg.auth_service_contract.events.request.UserGroupDeletedEvent;

import javax.validation.ConstraintViolation;
import javax.validation.Validator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static java.time.LocalDateTime.now;
import static java.util.Objects.nonNull;
import static ru.mycrg.auth_service.AuthJWTApplication.mapper;

@Service
@Transactional
@RepositoryEventHandler
public class GroupService {

    private final Logger log = LoggerFactory.getLogger(GroupService.class);

    private static final String GROUP = "Группа";
    private static final String ORGANIZATION = "Организация";

    private final Validator validator;
    private final GroupRepository groupRepository;
    private final UserService userService;
    private final ProjectionFactory projectionFactory;
    private final OrganizationRepository orgRepository;
    private final IAuthenticationFacade authenticationFacade;
    private final MessageBusProducer messageBus;

    public GroupService(Validator validator,
                        GroupRepository groupRepository,
                        UserService userService,
                        ProjectionFactory projectionFactory,
                        IAuthenticationFacade authenticationFacade,
                        OrganizationRepository orgRepository,
                        MessageBusProducer messageBus) {
        this.validator = validator;
        this.userService = userService;
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
        newGroup.setCreatedAt(now());
        newGroup.setLastModified(now());

        Group savedGroup = groupRepository.save(newGroup);

        messageBus.produce(new CrgAuditEvent(authenticationFacade.getAccessToken(),
                                             "CREATE",
                                             savedGroup.getName(),
                                             "GROUP",
                                             savedGroup.getId(),
                                             mapper.convertValue(dto, JsonNode.class)));

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

    /**
     * Use only this authentication context.
     */
    public void addUser(Long groupId, Long userId) {
        addUser(authenticationFacade.getOrganizationId(),
                groupId,
                userId,
                authenticationFacade.getLogin(),
                authenticationFacade.getAccessToken());
    }

    public void addUser(Long orgId, Long groupId, Long userId, String creator, String accessToken) {
        log.debug("For org: '{}' Try add user: '{}' to group: '{}'", orgId, userId, groupId);

        Group group = groupRepository.findByIdAndOrganizationId(groupId, orgId)
                                     .orElseThrow(() -> new BadRequestException("Не найдена группа: " + groupId));

        Organization organization = orgRepository
                .findById(orgId)
                .orElseThrow(() -> new BadRequestException("Не найдена организация: " + orgId));

        log.debug("Group exist: {}", group);
        User user = organization.getUsers().stream()
                                .filter(u -> u.getId().equals(userId))
                                .findFirst()
                                .orElseThrow(() -> new BadRequestException("Не найден пользователь: " + userId));

        group.addUser(user);

        groupRepository.save(group);

        userService.upVersion(user);
        user.setUpdatedBy(creator);
        user.setLastModified(now());

        List<Long> updatedUsers = group.getUsers().stream().map(User::getId).collect(Collectors.toList());

        messageBus.produce(
                new CrgAuditEvent(accessToken,
                                  "ADD_USER",
                                  group.getName(),
                                  "GROUP",
                                  group.getId(),
                                  mapper.convertValue(updatedUsers, JsonNode.class)));
    }

    public void removeUser(Long groupId, Long userId) {
        Long orgId = authenticationFacade.getOrganizationId();

        log.debug("For org: '{}' Try delete user: '{}' from group: '{}'", userId, userId, groupId);

        Group group = groupRepository
                .findByIdAndOrganizationId(groupId, orgId)
                .orElseThrow(() -> new NotFoundException(GROUP, groupId));

        group.removeUser(userId);

        userService.upVersion(userId);
        userService.userUpdatedByAndLastModifiedUpdate(userId, authenticationFacade.getLogin());

        List<Long> updatedUsers = group.getUsers().stream().map(User::getId).collect(Collectors.toList());
        messageBus.produce(
                new CrgAuditEvent(authenticationFacade.getAccessToken(),
                                  "REMOVE_USER",
                                  group.getName(),
                                  "GROUP",
                                  userId,
                                  mapper.convertValue(updatedUsers, JsonNode.class)));
    }

    public void update(Long groupId, GroupUpdateDto dto) {
        final Long orgId = authenticationFacade.getOrganizationId();

        Group groupForUpdate = groupRepository.findByIdAndOrganizationId(groupId, orgId)
                                              .orElseThrow(() -> new NotFoundException(GROUP, groupId));

        if (nonNull(dto.getName())) {
            groupForUpdate.setName(dto.getName());
        }
        if (nonNull(dto.getDescription())) {
            groupForUpdate.setDescription(dto.getDescription());
        }

        groupForUpdate.setLastModified(now());

        groupRepository.save(groupForUpdate);

        messageBus.produce(
                new CrgAuditEvent(authenticationFacade.getAccessToken(),
                                  "UPDATE",
                                  groupForUpdate.getName(),
                                  "GROUP",
                                  groupForUpdate.getId(),
                                  mapper.convertValue(dto, JsonNode.class)));
    }

    public void delete(Long groupId) {
        Group group = groupRepository
                .findByIdAndOrganizationId(groupId, authenticationFacade.getOrganizationId())
                .orElseThrow(() -> new NotFoundException(GROUP, groupId));

        groupRepository.delete(group);

        messageBus.produce(
                new CrgAuditEvent(authenticationFacade.getAccessToken(),
                                  "DELETE",
                                  group.getName(),
                                  "GROUP",
                                  group.getId()));

        messageBus.produce(new UserGroupDeletedEvent(authenticationFacade.getAccessToken(), groupId));
    }

    private <T> void validate(T bean) {
        Set<ConstraintViolation<T>> violations = validator.validate(bean);
        if (!violations.isEmpty()) {
            throw new CrgValidationException(violations);
        }
    }
}
