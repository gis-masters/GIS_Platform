package unit;

import org.junit.Test;
import ru.mycrg.geoserver_client.services.user_role.UsersAndRolesService;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class PrepareNameGeoserverWorkaround {

    @Test
    public void shouldDuplicateDomain() {
        UsersAndRolesService service = new UsersAndRolesService("");

        assertNull(service.prepareUserNameForGeoserver(null));
        assertEquals("fiz@mail.ru.ru", service.prepareUserNameForGeoserver("fiz@mail.ru"));
        assertEquals("fiz@mail.com.com", service.prepareUserNameForGeoserver("fiz@mail.com"));
        assertEquals("fiz@mail", service.prepareUserNameForGeoserver("fiz@mail"));
        assertEquals("asd-test@mail.com.com", service.prepareUserNameForGeoserver("asd-test@mail.com"));
        assertEquals("asd.test@mail.ru.ru", service.prepareUserNameForGeoserver("asd.test@mail.ru"));
    }
}
