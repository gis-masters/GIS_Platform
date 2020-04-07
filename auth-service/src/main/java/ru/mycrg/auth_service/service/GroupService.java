package ru.mycrg.auth_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.data.rest.core.annotation.HandleBeforeSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.auth_service.dto.GroupCreateDto;
import ru.mycrg.auth_service.dto.GroupProjection;
import ru.mycrg.auth_service.entity.Group;
import ru.mycrg.auth_service.entity.Organization;
import ru.mycrg.auth_service.entity.User;
import ru.mycrg.auth_service.exeptions.CrgValidationException;
import ru.mycrg.auth_service.exeptions.NotFoundException;
import ru.mycrg.auth_service.repository.GroupRepository;
import ru.mycrg.auth_service.repository.OrganizationRepository;

import javax.validation.ConstraintViolation;
import javax.validation.Validator;
import java.time.LocalDateTime;
import java.util.Set;

import static ru.mycrg.auth_service.security.CrgClaimsParser.getOrganizationId;

@Service
@Transactional
@RepositoryEventHandler
public class GroupService {

    private static final Logger log = LoggerFactory.getLogger(GroupService.class);

    private final Validator validator;
    private final GroupRepository groupRepository;
    private final ProjectionFactory projectionFactory;
    private final OrganizationRepository orgRepository;

    public GroupService(Validator validator,
                        GroupRepository groupRepository,
                        ProjectionFactory projectionFactory,
                        OrganizationRepository orgRepository) {
        this.validator = validator;
        this.groupRepository = groupRepository;
        this.projectionFactory = projectionFactory;
        this.orgRepository = orgRepository;
    }

    @HandleBeforeSave
    public void beforeSave(Group group) {
        validate(new GroupCreateDto(group.getName(), group.getDescription()));
    }

    public GroupProjection create(GroupCreateDto dto, long orgId) {
        Organization organization = orgRepository
                .findById(orgId)
                .orElseThrow(() -> new NotFoundException(orgId));

        Group newGroup = new Group();
        newGroup.setName(dto.getName());
        newGroup.setDescription(dto.getDescription());
        newGroup.setOrganization(organization);
        newGroup.setCreatedAt(LocalDateTime.now());
        newGroup.setLastModified(LocalDateTime.now());

        Group savedGroup = groupRepository.save(newGroup);

        return projectionFactory.createProjection(GroupProjection.class, savedGroup);
    }

    public GroupProjection findById(Long id, Authentication authentication) {
        Long orgId = getOrganizationId(authentication);
        Group byId = groupRepository
                .findByIdAndOrganizationId(id, orgId)
                .orElseThrow(() -> new NotFoundException(id));

        return projectionFactory.createProjection(GroupProjection.class, byId);
    }

    public Page<GroupProjection> findAll(Pageable p, Authentication authentication) {
        Long orgId = getOrganizationId(authentication);

        return groupRepository.findByOrganizationId(orgId, p);
    }

    public void addUser(Long groupId, Long userId, Authentication authentication) {
        log.debug("Try add user: {} to group: {}", userId, groupId);

        Long orgId = getOrganizationId(authentication);
        Group group = groupRepository
                .findByIdAndOrganizationId(groupId, orgId)
                .orElseThrow(() -> new NotFoundException(groupId));

        Organization organization = orgRepository
                .findById(orgId)
                .orElseThrow(() -> new NotFoundException(orgId));

        User user = organization.getUsers().stream()
                .filter(u -> u.getId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException(userId));

        group.addUser(user);

        groupRepository.save(group);
    }

    public void removeUser(Long groupId, Long userId, Authentication authentication) {
        log.debug("Try delete user: {} from group: {}", userId, groupId);

        Long orgId = getOrganizationId(authentication);
        Group group = groupRepository
                .findByIdAndOrganizationId(groupId, orgId)
                .orElseThrow(() -> new NotFoundException(groupId));

        group.removeUser(userId);
    }

    private <T> void validate(T bean) {
        Set<ConstraintViolation<T>> violations = validator.validate(bean);
        if (!violations.isEmpty()) {
            throw new CrgValidationException(violations);
        }
    }
}
