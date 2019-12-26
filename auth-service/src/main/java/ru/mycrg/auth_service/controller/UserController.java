package ru.mycrg.auth_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.auth_service_contract.dto.UserInfoModel;
import ru.mycrg.auth_service.entity.Organization;
import ru.mycrg.auth_service.entity.User;
import ru.mycrg.auth_service.repository.UserRepository;

import javax.persistence.EntityNotFoundException;
import java.security.Principal;
import java.util.Set;

@RestController
@RequestMapping(value = "/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/current")
    public ResponseEntity<UserInfoModel> getUserInfo(Principal principal) {
        String userName = principal.getName();

        User user = userRepository.findByUsername(userName)
                                  .orElseThrow(() -> new EntityNotFoundException("Not found user: " + userName));

        Set<Organization> organizations = user.getOrganizations();
        if (!organizations.isEmpty()) {
            Organization organization = organizations.iterator().next();

            return ResponseEntity.ok(new UserInfoModel(userName, organization.getName(), organization.getId()));
        }

        return ResponseEntity.ok(new UserInfoModel(userName));
    }
}
