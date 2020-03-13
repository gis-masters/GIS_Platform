package ru.mycrg.auth_service.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import ru.mycrg.auth_service.dto.UserCreateDto;
import ru.mycrg.auth_service.dto.UserProjection;
import ru.mycrg.auth_service.service.AuthorityService;
import ru.mycrg.auth_service.service.UserService;
import ru.mycrg.auth_service_contract.dto.UserInfoModel;

import javax.validation.Valid;
import java.net.URI;
import java.security.Principal;

import static ru.mycrg.auth_service.config.Authorities.GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY;
import static ru.mycrg.auth_service.security.CrgClaimsParser.getOrganizationId;
import static ru.mycrg.auth_service.security.CrgClaimsParser.isRoot;

@RestController
@RequestMapping(value = "/users")
public class UserController {

    private final AuthorityService authorityService;
    private final UserService userService;

    public UserController(UserService userService, AuthorityService authorityService) {
        this.userService = userService;
        this.authorityService = authorityService;
    }

    @GetMapping("/current")
    public ResponseEntity<UserInfoModel> getUserInfo(Principal principal) {
        String userName = principal.getName();

        return ResponseEntity.ok(userService.getCurrent(userName));
    }

    @GetMapping
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Page<UserProjection>> getUsers(Pageable pageable, Authentication authentication) {

        Page<UserProjection> users = userService.findAll(pageable, authentication);

        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public Resource<UserProjection> getUserById(@PathVariable Long id, Authentication authentication) {

        UserProjection userProjection = userService.findById(id, authentication);

        return new Resource<>(userProjection);
    }

    @PostMapping
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

    @PostMapping("/{id}/roles/{authority}")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> addRole(@PathVariable Long id,
                                          @PathVariable String authority,
                                          Authentication authentication) {
        if (!authorityService.isAuthorityExist(authority)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Role not exist: " + authority);
        }

        userService.addAuthority(id, authority, authentication);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/{id}/roles/{authority}")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public HttpStatus removeRole(@PathVariable Long id,
                                             @PathVariable String authority,
                                             Authentication authentication) {
        userService.removeAuthority(id, authority, authentication);

        return HttpStatus.NO_CONTENT;
    }

    @DeleteMapping("/{id}")
    @PreAuthorize(GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY)
    public HttpStatus deleteUser(@PathVariable Long id, Authentication authentication) {
        userService.delete(id, authentication);

        return HttpStatus.NO_CONTENT;
    }

}
