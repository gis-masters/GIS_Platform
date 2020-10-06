package ru.mycrg.gis_service.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.hateoas.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.gis_service.dto.GroupCreateDto;
import ru.mycrg.gis_service.dto.GroupProjection;
import ru.mycrg.gis_service.service.GroupService;

import javax.json.JsonMergePatch;
import javax.validation.Valid;
import java.util.List;

import static ru.mycrg.gis_service.config.Authorities.GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY;
import static ru.mycrg.gis_service.config.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.gis_service.config.MediaTypes.APPLICATION_JSON_MERGE_PATCH;

@RestController
@RequestMapping("/projects/{project_id}")
public class GroupController {

    private static final Logger log = LoggerFactory.getLogger(GroupController.class);

    private final GroupService groupService;

    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    @GetMapping("/groups")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<List<GroupProjection>> getGroups(@PathVariable(name = "project_id") long projectId,
                                                           Authentication authentication) {
        List<GroupProjection> groups = groupService.getAll(projectId, authentication);

        return ResponseEntity.ok(groups);
    }

    @PostMapping("/groups")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<GroupProjection> createGroup(@PathVariable(name = "project_id") long projectId,
                                                       @Valid @RequestBody GroupCreateDto dto,
                                                       Authentication authentication) {
        GroupProjection groupProjection = groupService.create(projectId, dto, authentication);

        return new ResponseEntity<>(groupProjection, HttpStatus.CREATED);
    }

    @GetMapping("/groups/{group_id}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public Resource<GroupProjection> getGroupById(@PathVariable(name = "project_id") long projectId,
                                                  @PathVariable(name = "group_id") long groupId,
                                                  Authentication authentication) {
        GroupProjection group = groupService.findById(projectId, groupId, authentication);

        return new Resource<>(group);
    }

    @PatchMapping(path = "/groups/{group_id}", consumes = APPLICATION_JSON_MERGE_PATCH)
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> updateGroup(@PathVariable(name = "project_id") long projectId,
                                              @PathVariable(name = "group_id") long groupId,
                                              @RequestBody JsonMergePatch patchDto,
                                              Authentication authentication) {
        log.info("patch update group: {}", patchDto.toJsonValue());

        groupService.update(projectId, groupId, patchDto, authentication);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/groups/{group_id}")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> deleteGroup(@PathVariable(name = "project_id") long projectId,
                                              @PathVariable(name = "group_id") long groupId,
                                              Authentication authentication) {
        groupService.delete(projectId, groupId, authentication);

        return ResponseEntity.noContent().build();
    }

}
