package ru.mycrg.gis_service.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.hateoas.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.gis_service.dto.GroupCreateDto;
import ru.mycrg.gis_service.dto.GroupProjection;
import ru.mycrg.gis_service.service.GroupService;

import javax.json.JsonMergePatch;
import javax.validation.Valid;
import java.util.List;

import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.common_utils.MediaTypes.APPLICATION_JSON_MERGE_PATCH;

@RestController
@RequestMapping("/projects/{project_id}")
public class GroupController {

    private final Logger log = LoggerFactory.getLogger(GroupController.class);

    private final GroupService groupService;

    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    @GetMapping("/groups")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<List<GroupProjection>> getGroups(@PathVariable(name = "project_id") long projectId) {
        List<GroupProjection> groups = groupService.getAll(projectId);

        return ResponseEntity.ok(groups);
    }

    @PostMapping("/groups")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<GroupProjection> createGroup(@PathVariable(name = "project_id") long projectId,
                                                       @Valid @RequestBody GroupCreateDto dto) {
        GroupProjection groupProjection = groupService.create(projectId, dto);

        return new ResponseEntity<>(groupProjection, HttpStatus.CREATED);
    }

    @GetMapping("/groups/{group_id}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public Resource<GroupProjection> getGroupById(@PathVariable(name = "project_id") long projectId,
                                                  @PathVariable(name = "group_id") long groupId) {
        GroupProjection group = groupService.findById(projectId, groupId);

        return new Resource<>(group);
    }

    @PatchMapping(path = "/groups/{group_id}", consumes = APPLICATION_JSON_MERGE_PATCH)
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> updateGroup(@PathVariable(name = "project_id") long projectId,
                                              @PathVariable(name = "group_id") long groupId,
                                              @RequestBody JsonMergePatch patchDto) {
        log.info("patch update group: {}", patchDto.toJsonValue());

        groupService.update(projectId, groupId, patchDto);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/groups/{group_id}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> deleteGroup(@PathVariable(name = "project_id") long projectId,
                                              @PathVariable(name = "group_id") long groupId) {
        groupService.delete(projectId, groupId);

        return ResponseEntity.noContent().build();
    }
}
