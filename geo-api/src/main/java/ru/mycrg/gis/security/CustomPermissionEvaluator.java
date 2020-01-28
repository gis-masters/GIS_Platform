package ru.mycrg.gis.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import ru.mycrg.gis.service.ProcessService;

import java.io.Serializable;

import static ru.mycrg.gis.security.CrgClaimsParser.getOrganizationId;

@Service("permissionEvaluator")
public class CustomPermissionEvaluator implements PermissionEvaluator {

    private static Logger log = LoggerFactory.getLogger(CustomPermissionEvaluator.class);

    @Autowired
    private ProcessService processService;

    @Override
    public boolean hasPermission(Authentication authentication, Object targetEndpoint, Object id) {
        String userName = authentication.getName();

        log.info("check permission for user: {} to: '{}' / {}", userName, targetEndpoint, id);

        if ("processes".equals(targetEndpoint)) {
            return processService.isUserOwnProcess(userName, (Long) id);
        } else {
            return false;
        }
    }

    @Override
    public boolean hasPermission(Authentication authentication, Serializable serializable, String s, Object o) {
        log.warn("Not implemented yet");

        return false;
    }
}
