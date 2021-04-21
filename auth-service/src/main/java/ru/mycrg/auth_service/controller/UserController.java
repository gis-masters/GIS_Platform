package ru.mycrg.auth_service.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import ru.mycrg.auth_service.dto.UserProjection;
import ru.mycrg.auth_service.security.IAuthenticationFacade;
import ru.mycrg.auth_service.service.UserService;
import ru.mycrg.auth_service_contract.dto.UserCreateDto;
import ru.mycrg.auth_service_contract.dto.UserInfoModel;
import ru.mycrg.auth_service_contract.dto.UserUpdateDto;

import javax.inject.Inject;
import javax.validation.Valid;
import java.net.URI;
import java.security.Principal;

import static ru.mycrg.auth_service_contract.Authorities.*;

@RepositoryRestController
public class UserController {

    @Inject
    private LocalValidatorFactoryBean validator;

    @InitBinder
    protected void initBinder(WebDataBinder binder) {
        binder.addValidators(validator);
    }

    private final UserService userService;
    private final PagedResourcesAssembler<UserProjection> assembler;
    private final IAuthenticationFacade authenticationFacade;

    public UserController(UserService userService,
                          IAuthenticationFacade authenticationFacade,
                          PagedResourcesAssembler<UserProjection> assembler) {
        this.assembler = assembler;
        this.userService = userService;
        this.authenticationFacade = authenticationFacade;
    }

    @GetMapping("/users/current")
    public ResponseEntity<UserInfoModel> getUserInfo(Principal principal) {
        String userName = principal.getName();

        return ResponseEntity.ok(userService.getCurrent(userName));
    }

    @GetMapping("/users")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> getUsers(Pageable pageable) {
        Page<UserProjection> users = userService.findAll(pageable);

        return ResponseEntity.ok(assembler.toResource(users));
    }

    @PostMapping("/users")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> createUser(@Valid @RequestBody UserCreateDto userCreateDto,
                                             @RequestParam(name = "orgId", required = false) Long orgId) {
        Long organizationId;
        if (authenticationFacade.isRoot()) {
            if (orgId == null) {
                return new ResponseEntity<>("Provide organization identifier as 'orgId'", HttpStatus.BAD_REQUEST);
            } else {
                organizationId = orgId;
            }
        } else { // Ignore request orgId in this case
            organizationId = authenticationFacade.getOrganizationId();
        }

        UserProjection user = userService.create(userCreateDto, organizationId);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/{id}")
                .buildAndExpand(user.getId())
                .toUri();

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(location);

        return new ResponseEntity<>(headers, HttpStatus.ACCEPTED);
    }

    @GetMapping("/users/{id}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<UserProjection> getUserById(@PathVariable Long id) {
        UserProjection userProjection = userService.findProjectionById(id);

        return ResponseEntity.ok(userProjection);
    }

    @PatchMapping("/users/{id}")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<UserProjection> updateUser(@Valid @RequestBody UserUpdateDto dto,
                                                     @PathVariable Long id) {
        userService.update(id, dto);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> deleteUser(@PathVariable Long id) {
        userService.delete(id);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/users/{id}/roles/{authority}")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> addAuthority(@PathVariable Long id,
                                               @PathVariable String authority) {
        if (!isAuthorityExist(authority)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Authority not exist: " + authority);
        }

        userService.addAuthority(id, authority);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/users/{id}/roles/{authority}")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> removeAuthority(@PathVariable Long id,
                                                  @PathVariable String authority) {
        userService.removeAuthority(id, authority);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @ResponseBody
    @PutMapping("/users/{id}")
    public ResponseEntity<Object> updateUsers(@PathVariable String id) {
        return new ResponseEntity<>(HttpStatus.METHOD_NOT_ALLOWED);
    }
}
