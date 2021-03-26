package ru.mycrg.gis_service.service;

import org.springframework.data.projection.ProjectionFactory;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.gis_service.dto.GroupCreateDto;
import ru.mycrg.gis_service.dto.GroupProjection;
import ru.mycrg.gis_service.dto.GroupUpdateDto;
import ru.mycrg.gis_service.entity.Group;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service.exceptions.BadRequestException;
import ru.mycrg.gis_service.exceptions.NotFoundException;
import ru.mycrg.gis_service.json.JsonPatcher;
import ru.mycrg.gis_service.repository.GroupRepository;

import javax.json.JsonMergePatch;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import static ru.mycrg.gis_service.mappers.GroupMapper.groupMapper;
import static ru.mycrg.gis_service.service.GroupValidator.isInvalidGroupRelation;

@Service
@Transactional
public class GroupService {

    private final ProjectService projectService;
    private final GroupRepository groupRepository;
    private final JsonPatcher jsonPatcher;
    private final ProjectionFactory projectionFactory;

    public GroupService(GroupRepository groupRepository,
                        ProjectService projectService,
                        JsonPatcher jsonPatcher,
                        ProjectionFactory projectionFactory) {
        this.jsonPatcher = jsonPatcher;
        this.projectService = projectService;
        this.groupRepository = groupRepository;
        this.projectionFactory = projectionFactory;
    }

    public List<GroupProjection> getAll(long projectId, Authentication authentication) {
        return getProjectGroups(projectId, authentication).stream()
                .map(group -> projectionFactory.createProjection(GroupProjection.class, group))
                .collect(Collectors.toList());
    }

    public GroupProjection create(long projectId, GroupCreateDto dto, Authentication authentication) {
        Project project = projectService.getById(projectId, authentication);

        Group group = new Group(dto);
        if (isInvalidGroupRelation(group, project.getGroups())) {
            throw new BadRequestException("parent: Родительская группа задана неверно");
        }

        group.setProject(project);

        Group savedGroup = groupRepository.save(group);

        return projectionFactory.createProjection(GroupProjection.class, savedGroup);
    }

    public GroupProjection findById(long projectId, long groupId, Authentication authentication) {
        List<Group> groups = getProjectGroups(projectId, authentication);
        Group group = getGroupById(groups, groupId);

        return projectionFactory.createProjection(GroupProjection.class, group);
    }

    public void update(long projectId, long groupId, JsonMergePatch patchDto, Authentication authentication) {
        List<Group> groups = getProjectGroups(projectId, authentication);
        Group groupForUpdate = getGroupById(groups, groupId);

        GroupUpdateDto groupDto = groupMapper.toDto(groupForUpdate);
        GroupUpdateDto patchedGroup = jsonPatcher.mergePatch(patchDto, groupDto, GroupUpdateDto.class);

        groupMapper.update(groupForUpdate, patchedGroup);

        if (isInvalidGroupRelation(groupForUpdate, groups)) {
            throw new BadRequestException("parent: Родительская группа задана неверно");
        }

        groupForUpdate.setLastModified(LocalDateTime.now());

        groupRepository.save(groupForUpdate);
    }

    public void delete(long projectId, long groupId, Authentication authentication) {
        List<Group> groups = getProjectGroups(projectId, authentication);
        Group group = getGroupById(groups, groupId);

        groupRepository.deleteGroupById(group.getId());
    }

    private List<Group> getProjectGroups(long projectId, Authentication authentication) {
        return projectService
                .getById(projectId, authentication)
                .getGroups();
    }

    private Group getGroupById(List<Group> groups, Long groupId) {
        return groups.stream()
                .filter(g -> g.getId().equals(groupId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException(groupId));
    }
}
