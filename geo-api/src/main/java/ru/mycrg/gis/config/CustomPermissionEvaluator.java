package ru.mycrg.gis.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import ru.mycrg.gis.service.OrganizationService;

import java.io.Serializable;

@Service("permissionEvaluator")
public class CustomPermissionEvaluator implements PermissionEvaluator {

    private static Logger log = LoggerFactory.getLogger(CustomPermissionEvaluator.class);

    private final OrganizationService organizationService;

    public CustomPermissionEvaluator(OrganizationService organizationService) {
        this.organizationService = organizationService;
    }

    @Override
    public boolean hasPermission(Authentication authentication, Object orgId, Object userName) {
        log.debug("hasPermission: {} for orgId: {}", authentication.getName(), orgId);

        return organizationService.isUserExistByName(Long.parseLong(orgId.toString()), authentication.getName());
    }

    @Override
    public boolean hasPermission(Authentication authentication, Serializable serializable, String s, Object o) {
        log.warn("Not implemented yet");

        return false;
    }
}
