package ru.mycrg.auth_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import ru.mycrg.auth_service.dto.UserCreateDto;
import ru.mycrg.auth_service.entity.User;
import ru.mycrg.auth_service.repository.OrganizationRepository;
import ru.mycrg.auth_service.service.UserService;
import ru.mycrg.auth_service_contract.dto.UserInfoModel;

import javax.validation.Valid;
import java.net.URI;
import java.security.Principal;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static ru.mycrg.auth_service.security.CrgClaimsParser.getOrganizationId;
import static ru.mycrg.auth_service.security.CrgClaimsParser.isRoot;

@RestController
@RequestMapping(value = "/users")
public class UserController {

    @Autowired
    private PagedResourcesAssembler<User> assembler;

    @Autowired
    private EntityLinks links;

    @Autowired
    private UserService userService;

    @Autowired
    private OrganizationRepository orgRepository;

    @GetMapping("/current")
    public ResponseEntity<UserInfoModel> getUserInfo(Principal principal) {
        String userName = principal.getName();

        return ResponseEntity.ok(userService.getCurrent(userName));
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'GEOSERVER_ADMIN')")
    public ResponseEntity<?> getUsers(Pageable pageable, Authentication authentication) {

        Page<User> users = userService.findAll(pageable, authentication);

        Link pageSelfLink = links.linkFor(User.class).withSelfRel();
        PagedResources<?> pagedResources = assembler.toResource(users, this::toResource, pageSelfLink);

        return ResponseEntity.ok(pagedResources);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'GEOSERVER_ADMIN')")
    public Resource<User> getUserById(@PathVariable Long id, Authentication authentication) {

        User user = userService.findById(id, authentication);

        Resource<User> resource = new Resource<>(user);
        resource.add(linkTo(UserController.class).slash(user.getId()).withSelfRel());

        return resource;
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'GEOSERVER_ADMIN')")
    public ResponseEntity createUser(@Valid @RequestBody UserCreateDto userCreateDto,
                                     @RequestParam(name = "orgId", required = false) Long orgId,
                                     Authentication authentication) {
        Long organizationId;
        if (isRoot(authentication)) {
            if (orgId == null) {
                return new ResponseEntity("Provide organization identifier as 'orgId'", HttpStatus.BAD_REQUEST);
            } else {
                organizationId = orgId;
            }
        } else { // Ignore request orgId in this case
            organizationId = getOrganizationId(authentication);
        }

        User user = userService.create(userCreateDto, organizationId);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/{id}")
                .buildAndExpand(user.getId())
                .toUri();

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(location);

        return new ResponseEntity(headers, HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'GEOSERVER_ADMIN')")
    public HttpStatus deleteUser(@PathVariable Long id, Authentication authentication) {
        userService.delete(id, authentication);

        return HttpStatus.ACCEPTED;
    }

    private ResourceSupport toResource(User user) {
        Link selfLink = links.linkForSingleResource(user).withSelfRel();

        return new Resource<>(user, selfLink);
    }

}
