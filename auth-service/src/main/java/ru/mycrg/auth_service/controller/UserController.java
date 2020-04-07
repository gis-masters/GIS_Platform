package ru.mycrg.auth_service.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import ru.mycrg.auth_service.dto.UserCreateDto;
import ru.mycrg.auth_service.dto.UserProjection;
import ru.mycrg.auth_service.service.AuthorityService;
import ru.mycrg.auth_service.service.UserService;
import ru.mycrg.auth_service_contract.dto.UserInfoModel;

import javax.inject.Inject;
import javax.validation.Valid;
import java.net.URI;
import java.security.Principal;

import static ru.mycrg.auth_service.config.Authorities.GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY;
import static ru.mycrg.auth_service.security.CrgClaimsParser.getOrganizationId;
import static ru.mycrg.auth_service.security.CrgClaimsParser.isRoot;

@RepositoryRestController
public class UserController {

    @Inject
    private LocalValidatorFactoryBean validator;

    @InitBinder
    protected void initBinder(WebDataBinder binder) {
        binder.addValidators(validator);
    }

    private final UserService userService;
    private final AuthorityService authorityService;
    private final PagedResourcesAssembler<UserProjection> assembler;

    public UserController(UserService userService,
                          AuthorityService authorityService,
                          PagedResourcesAssembler<UserProjection> assembler) {
        this.assembler = assembler;
        this.userService = userService;
        this.authorityService = authorityService;
    }

    @GetMapping("/users/current")
    public ResponseEntity<UserInfoModel> getUserInfo(Principal principal) {
        String userName = principal.getName();

        return ResponseEntity.ok(userService.getCurrent(userName));
    }

    @GetMapping("/users")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> getUsers(Pageable p, Authentication authentication) {
        Page<UserProjection> users = userService.findAll(p, authentication);

        return ResponseEntity.ok(assembler.toResource(users));
    }

    @GetMapping("/users/{id}")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<UserProjection> getUserById(@PathVariable Long id, Authentication authentication) {
        UserProjection userProjection = userService.findById(id, authentication);

        return ResponseEntity.ok(userProjection);
    }

    @PostMapping("/users")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> createUser(@Valid @RequestBody UserCreateDto userCreateDto,
                                             @RequestParam(name = "orgId", required = false) Long orgId,
                                             Authentication authentication) {
        Long organizationId;
        if (isRoot(authentication)) {
            if (orgId == null) {
                return new ResponseEntity<>("Provide organization identifier as 'orgId'", HttpStatus.BAD_REQUEST);
            } else {
                organizationId = orgId;
            }
        } else { // Ignore request orgId in this case
            organizationId = getOrganizationId(authentication);
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

    @DeleteMapping("/users/{id}")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> deleteUser(@PathVariable Long id, Authentication authentication) {
        userService.delete(id, authentication);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/users/{id}/roles/{authority}")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> addAuthority(@PathVariable Long id,
                                               @PathVariable String authority,
                                               Authentication authentication) {
        if (!authorityService.isAuthorityExist(authority)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Authority not exist: " + authority);
        }

        userService.addAuthority(id, authority, authentication);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/users/{id}/roles/{authority}")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> removeAuthority(@PathVariable Long id,
                                                  @PathVariable String authority,
                                                  Authentication authentication) {
        userService.removeAuthority(id, authority, authentication);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @ResponseBody
    @PutMapping("/users/{id}")
    public ResponseEntity<Object> updateUsers(@PathVariable String id) {
        return new ResponseEntity<>(HttpStatus.METHOD_NOT_ALLOWED);
    }

}
