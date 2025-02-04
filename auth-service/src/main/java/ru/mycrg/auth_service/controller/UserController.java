package ru.mycrg.auth_service.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.auth_service.dto.UserProjection;
import ru.mycrg.auth_service.entity.User;
import ru.mycrg.auth_service.exceptions.BadRequestException;
import ru.mycrg.auth_service.repository.UserRepository;
import ru.mycrg.auth_service.service.UserService;
import ru.mycrg.auth_service_contract.dto.IdNameProjection;
import ru.mycrg.auth_service_contract.dto.UserCreateDto;
import ru.mycrg.auth_service_contract.dto.UserInfoModel;
import ru.mycrg.auth_service_contract.dto.UserUpdateDto;

import javax.inject.Inject;
import javax.validation.Valid;
import java.net.URI;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import static ru.mycrg.auth_service_contract.Authorities.*;
import static ru.mycrg.common_utils.page.PageHandler.pageFromList;

@RepositoryRestController
public class UserController {

    @Inject
    private LocalValidatorFactoryBean validator;

    @InitBinder
    protected void initBinder(WebDataBinder binder) {
        binder.addValidators(validator);
    }

    private final UserService userService;
    private final UserRepository userRepository;
    private final IAuthenticationFacade authenticationFacade;

    public UserController(UserService userService,
                          UserRepository userRepository,
                          IAuthenticationFacade authenticationFacade) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.authenticationFacade = authenticationFacade;
    }

    @GetMapping("/users/current")
    public ResponseEntity<UserInfoModel> getUserInfo() {
        String login = authenticationFacade.getLogin();

        return ResponseEntity.ok(userService.getByLogin(login));
    }

    @GetMapping("/users/organizations")
    public ResponseEntity<List<IdNameProjection>> getUserOrganization(@RequestParam String login) {
        if (login.isBlank()) {
            throw new BadRequestException("Не задан login");
        }

        User user = userRepository.findByLoginIgnoreCase(login)
                                  .orElseThrow(() -> new BadRequestException("Не найден пользователь: " + login));

        List<IdNameProjection> result = user.getOrganizations().stream()
                                            .map(org -> new IdNameProjection(org.getId(), org.getName()))
                                            .sorted(Comparator.comparing(IdNameProjection::getName))
                                            .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @GetMapping("/users")
    @PreAuthorize(HAS_ANY_AUTHORITY)
    public ResponseEntity<Object> getUsers(@RequestParam(name = "filter", required = false) String ecqlFilter,
                                           Pageable pageable) {
        Page<UserProjection> users = userService.findAll(ecqlFilter, pageable);

        return ResponseEntity.ok(pageFromList(users, pageable));
    }

    @PostMapping("/users")
    @PreAuthorize(SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY)
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
        UserProjection userProjection = userService.findById(id);

        return ResponseEntity.ok(userProjection);
    }

    @PatchMapping("/users/{id}")
    @PreAuthorize(SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<UserProjection> updateUser(@Valid @RequestBody UserUpdateDto dto,
                                                     @PathVariable Long id) {
        userService.update(id, dto);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize(SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> deleteUser(@PathVariable Long id) {
        userService.delete(id);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/users/{id}/roles/{authority}")
    @PreAuthorize(SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> addAuthority(@PathVariable Long id,
                                               @PathVariable String authority) {
        if (!isAuthorityExist(authority)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Authority not exist: " + authority);
        }

        userService.addAuthority(id, authority);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/users/{id}/roles/{authority}")
    @PreAuthorize(SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY)
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

    @PostMapping("/users/invite")
    @PreAuthorize(SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY)
    public ResponseEntity<Object> inviteUser(@RequestParam(name = "email") String email) {
        Long organizationId = authenticationFacade.getOrganizationId();
        userService.invite(email, organizationId);

        return ResponseEntity.ok().build();
    }
}
