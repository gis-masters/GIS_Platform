package ru.mycrg.gis_service.service;

import org.springframework.data.projection.ProjectionFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.gis_service.dto.GroupCreateDto;
import ru.mycrg.gis_service.dto.GroupProjection;
import ru.mycrg.gis_service.dto.GroupUpdateDto;
import ru.mycrg.gis_service.dto.project.ProjectProjectionImpl;
import ru.mycrg.gis_service.entity.Group;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service.exceptions.BadRequestException;
import ru.mycrg.gis_service.exceptions.ForbiddenException;
import ru.mycrg.gis_service.exceptions.NotFoundException;
import ru.mycrg.gis_service.json.JsonPatcher;
import ru.mycrg.gis_service.repository.GroupRepository;
import ru.mycrg.gis_service.service.projects.ProjectService;

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
    private final ProjectProtector projectProtector;

    public GroupService(GroupRepository groupRepository,
                        ProjectService projectService,
                        JsonPatcher jsonPatcher,
                        ProjectionFactory projectionFactory,
                        ProjectProtector projectProtector) {
        this.jsonPatcher = jsonPatcher;
        this.projectService = projectService;
        this.groupRepository = groupRepository;
        this.projectionFactory = projectionFactory;
        this.projectProtector = projectProtector;
    }

    public List<GroupProjection> getAll(long projectId) {
        return getProjectGroups(projectId).stream()
                                          .map(group -> projectionFactory.createProjection(GroupProjection.class,
                                                                                           group))
                                          .collect(Collectors.toList());
    }

    public GroupProjection create(long projectId, GroupCreateDto dto) {
        ProjectProjectionImpl projectProjection = projectService.getByIdWithRole(projectId);
        if (projectProtector.lessThenContributor(projectProjection)) {
            throw new ForbiddenException("редактирования", "проекта", projectProjection.getName());
        }

        Group group = new Group(dto);
        Project project = projectService.getById(projectId);
        if (isInvalidGroupRelation(group, project.getGroups())) {
            throw new BadRequestException("parent: Родительская группа задана неверно");
        }

        group.setProject(project);

        Group savedGroup = groupRepository.save(group);

        return projectionFactory.createProjection(GroupProjection.class, savedGroup);
    }

    public GroupProjection findById(long projectId, long groupId) {
        List<Group> groups = getProjectGroups(projectId);
        Group group = getGroupById(groups, groupId);

        return projectionFactory.createProjection(GroupProjection.class, group);
    }

    public void update(long projectId, long groupId, JsonMergePatch patchDto) {
        ProjectProjectionImpl projectProjection = projectService.getByIdWithRole(projectId);
        if (projectProtector.lessThenContributor(projectProjection)) {
            throw new ForbiddenException("редактирования", "проекта", projectProjection.getName());
        }

        List<Group> groups = projectService.getById(projectId).getGroups();
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

    public void delete(long projectId, long groupId) {
        ProjectProjectionImpl projectProjection = projectService.getByIdWithRole(projectId);
        if (projectProtector.lessThenContributor(projectProjection)) {
            throw new ForbiddenException("редактирования", "проекта", projectProjection.getName());
        }

        List<Group> groups = projectService.getById(projectId).getGroups();
        Group group = getGroupById(groups, groupId);

        groupRepository.deleteGroupById(group.getId());
    }

    private List<Group> getProjectGroups(long projectId) {
        return projectService.getById(projectId)
                             .getGroups();
    }

    private Group getGroupById(List<Group> groups, Long groupId) {
        return groups.stream()
                     .filter(g -> g.getId().equals(groupId))
                     .findFirst()
                     .orElseThrow(() -> new NotFoundException(groupId));
    }
}
