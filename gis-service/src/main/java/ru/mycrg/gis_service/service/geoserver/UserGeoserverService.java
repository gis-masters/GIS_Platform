package ru.mycrg.gis_service.service.geoserver;

import org.springframework.stereotype.Service;
import ru.mycrg.geoserver_client.dto.UserGeoserverDto;
import ru.mycrg.geoserver_client.services.user_role.UsersAndRolesService;
import ru.mycrg.gis_service.exceptions.GisServiceException;
import ru.mycrg.gis_service.security.AuthenticationFacade;
import ru.mycrg.http_client.ResponseModel;

@Service
public class UserGeoserverService {

    private final AuthenticationFacade authenticationFacade;

    public UserGeoserverService(AuthenticationFacade authenticationFacade) {
        this.authenticationFacade = authenticationFacade;
    }

    public void create(UserGeoserverDto dto) {
        String token = authenticationFacade.getAccessToken();

        UsersAndRolesService usersAndRolesService = new UsersAndRolesService(token);
        try {
            checkGeoserverResponse(usersAndRolesService.createUser(dto.getUserName(), dto.getPassword()));
            checkGeoserverResponse(usersAndRolesService.associateUserWithRole(dto.getUserName(), dto.getRole()));
        } catch (Exception e) {
            throw new GisServiceException("Не удалось создать пользователя на геосервере: " + e.getMessage());
        }
    }

    public void delete(UserGeoserverDto dto) {
        try {
            UsersAndRolesService usersAndRolesService = new UsersAndRolesService(authenticationFacade.getAccessToken());

            checkGeoserverResponse(usersAndRolesService.deleteUser(dto.getUserName()));
        } catch (Exception e) {
            throw new GisServiceException("Не удалось удалить пользователя на геосервере: " + e.getMessage());
        }
    }

    private void checkGeoserverResponse(ResponseModel<Object> response) {
        if (!response.isSuccessful()) {
            throw new GisServiceException("Ответ геосервера: " + response);
        }
    }
}
