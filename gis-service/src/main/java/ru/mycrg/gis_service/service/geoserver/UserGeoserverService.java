package ru.mycrg.gis_service.service.geoserver;

import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.geoserver_client.dto.UserGeoserverDto;
import ru.mycrg.geoserver_client.services.user_role.UsersAndRolesService;
import ru.mycrg.gis_service.exceptions.GisServiceException;
import ru.mycrg.http_client.ResponseModel;

import java.util.List;

@Service
public class UserGeoserverService {

    private final IAuthenticationFacade authenticationFacade;

    public UserGeoserverService(IAuthenticationFacade authenticationFacade) {
        this.authenticationFacade = authenticationFacade;
    }

    public void create(UserGeoserverDto dto) {
        String token = authenticationFacade.getAccessToken();

        UsersAndRolesService usersAndRolesService = new UsersAndRolesService(token);
        try {
            checkGeoserverResponseAsString(usersAndRolesService.createUser(dto.getGeoserverLogin(), dto.getPassword()));
            checkGeoserverResponseAsString(usersAndRolesService.associateUserWithRole(dto.getGeoserverLogin(), dto.getRole()));
        } catch (Exception e) {
            throw new GisServiceException("Не удалось создать пользователя на геосервере: " + e.getMessage());
        }
    }

    public void delete(UserGeoserverDto dto) {
        try {
            UsersAndRolesService usersAndRolesService = new UsersAndRolesService(authenticationFacade.getAccessToken());
            String login = dto.getGeoserverLogin();

            List<String> roles = usersAndRolesService.getUserRoles(login);

            for (String role: roles) {
                usersAndRolesService.disassociateUserWithRole(login, role);
            }

            checkGeoserverResponse(usersAndRolesService.deleteUser(login));
        } catch (Exception e) {
            throw new GisServiceException("Не удалось удалить пользователя на геосервере: " + e.getMessage());
        }
    }

    private void checkGeoserverResponse(ResponseModel<Object> response) {
        if (!response.isSuccessful()) {
            throw new GisServiceException("Ответ геосервера: " + response);
        }
    }

    private void checkGeoserverResponseAsString(ResponseModel<String> response) {
        if (!response.isSuccessful()) {
            throw new GisServiceException("Ответ геосервера: " + response);
        }
    }
}
