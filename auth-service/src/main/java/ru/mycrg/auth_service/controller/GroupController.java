package ru.mycrg.auth_service.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import ru.mycrg.auth_service.dto.GroupProjection;
import ru.mycrg.auth_service.service.GroupService;
import ru.mycrg.auth_service_contract.dto.GroupCreateDto;

import javax.inject.Inject;
import javax.validation.Valid;

import static ru.mycrg.auth_service.security.CrgClaimsParser.getOrganizationId;
import static ru.mycrg.auth_service_contract.Authorities.HAS_ANY_AUTHORITY;

@RepositoryRestController
public class GroupController {

    @Inject
    private LocalValidatorFactoryBean validator;

    @InitBinder
    protected void initBinder(WebDataBinder binder) {
        binder.addValidators(validator);
    }

    private final GroupService groupService;
    private final PagedResourcesAssembler<GroupProjection> assembler;

    public GroupController(PagedResourcesAssembler<GroupProjection> assembler,
                           GroupService groupService) {
        this.assembler = assembler;
        this.groupService = groupService;
    }

    @PostMapping("/groups")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<GroupProjection> createGroup(@Valid @RequestBody GroupCreateDto dto,
                                                       Authentication authentication) {
        long orgId = getOrganizationId(authentication);

        GroupProjection groupProjection = groupService.create(dto, orgId);

        return ResponseEntity.ok(groupProjection);
    }

    @GetMapping("/groups")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> getAllGroups(Pageable p, Authentication authentication) {
        Page<GroupProjection> groupProjection = groupService.findAll(p, authentication);

        return ResponseEntity.ok(assembler.toResource(groupProjection));
    }

    @GetMapping("/groups/{id}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<GroupProjection> getGroupById(@PathVariable Long id, Authentication authentication) {
        GroupProjection groupProjection = groupService.findById(id, authentication);

        return ResponseEntity.ok(groupProjection);
    }

    @PostMapping("/groups/{id}/users/{userId}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> addAuthority(@PathVariable Long id,
                                               @PathVariable Long userId,
                                               Authentication authentication) {
        groupService.addUser(id, userId, authentication);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/groups/{id}/users/{userId}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> removeAuthority(@PathVariable Long id,
                                                  @PathVariable Long userId,
                                                  Authentication authentication) {
        groupService.removeUser(id, userId, authentication);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @ResponseBody
    @PutMapping("/groups/{id}")
    public ResponseEntity<Object> updateGroups(@PathVariable String id) {
        return new ResponseEntity<>(HttpStatus.METHOD_NOT_ALLOWED);
    }
}
