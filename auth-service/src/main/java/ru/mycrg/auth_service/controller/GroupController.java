package ru.mycrg.auth_service.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.auth_service.dto.GroupProjection;
import ru.mycrg.auth_service.service.GroupService;
import ru.mycrg.auth_service_contract.dto.GroupCreateDto;
import ru.mycrg.auth_service_contract.dto.GroupUpdateDto;

import javax.inject.Inject;
import javax.validation.Valid;

import static org.springframework.http.HttpStatus.METHOD_NOT_ALLOWED;
import static org.springframework.http.HttpStatus.NO_CONTENT;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;
import static ru.mycrg.auth_service_contract.Authorities.SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY;
import static ru.mycrg.common_utils.page.PageHandler.pageFromList;

@RepositoryRestController
public class GroupController {

    @Inject
    private LocalValidatorFactoryBean validator;

    @InitBinder
    protected void initBinder(WebDataBinder binder) {
        binder.addValidators(validator);
    }

    private final GroupService groupService;

    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    @PostMapping("/groups")
    @PreAuthorize(SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<GroupProjection> createGroup(@Valid @RequestBody GroupCreateDto dto) {
        GroupProjection groupProjection = groupService.create(dto);

        return ResponseEntity.ok(groupProjection);
    }

    @GetMapping("/groups")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> getAllGroups(Pageable pageable) {
        Page<GroupProjection> groups = groupService.findAll(pageable);

        return ResponseEntity.ok(pageFromList(groups, pageable));
    }

    @GetMapping("/groups/{id}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<GroupProjection> getGroupById(@PathVariable Long id) {
        GroupProjection groupProjection = groupService.findById(id);

        return ResponseEntity.ok(groupProjection);
    }

    @PostMapping("/groups/{id}/users/{userId}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> addUser(@PathVariable Long id,
                                          @PathVariable Long userId) {
        groupService.addUser(id, userId);

        return new ResponseEntity<>(NO_CONTENT);
    }

    @DeleteMapping("/groups/{id}/users/{userId}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> removeUser(@PathVariable Long id,
                                             @PathVariable Long userId) {
        groupService.removeUser(id, userId);

        return new ResponseEntity<>(NO_CONTENT);
    }

    @ResponseBody
    @PutMapping("/groups/{id}")
    public ResponseEntity<Object> updateGroups(@PathVariable String id) {
        return new ResponseEntity<>(METHOD_NOT_ALLOWED);
    }

    @PatchMapping("/groups/{id}")
    @PreAuthorize(SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> updateGroups(@PathVariable Long id,
                                               @Valid @RequestBody GroupUpdateDto dto) {
        groupService.update(id, dto);

        return new ResponseEntity<>(NO_CONTENT);
    }

    @DeleteMapping("/groups/{id}")
    @PreAuthorize(SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> deleteGroup(@PathVariable Long id) {
        groupService.delete(id);

        return new ResponseEntity<>(NO_CONTENT);
    }
}
