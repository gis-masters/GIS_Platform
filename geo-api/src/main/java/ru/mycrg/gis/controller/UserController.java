package ru.mycrg.gis.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.mycrg.gis.dto.UserInfoModel;
import ru.mycrg.gis.entity.Organization;
import ru.mycrg.gis.service.OrganizationService;

import java.security.Principal;

/**
 * У нас пока нет сложившейся модели.
 * Пока наш пользователь создав организацию связан с ней 1 к 1 и посути и является организацией
 * Другие пользователи не добавляются к организациям
 */
@RestController
@RequestMapping(value = "/users")
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    private final OrganizationService organizationService;

    @Autowired
    public UserController(OrganizationService organizationService) {
        this.organizationService = organizationService;
    }

    @GetMapping("/info")
    public ResponseEntity<UserInfoModel> getUserInfo(Principal principal) {
        log.debug("get info for user: {}", principal.getName());

        Organization organization = organizationService.getOrganizationByUserName(principal.getName());

        return ResponseEntity.ok(new UserInfoModel(principal.getName(), organization.getName(), organization.getId()));
    }

}
