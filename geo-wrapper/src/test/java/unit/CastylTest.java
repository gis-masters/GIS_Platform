package unit;

import org.junit.Test;
import ru.mycrg.wrapper.service.geoserver.user_role.UsersAndRolesService;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class CastylTest {

    @Test
    public void shouldDuplicate() {
        UsersAndRolesService service = new UsersAndRolesService();

        assertNull(service.castyl(null));
        assertEquals("fiz@mail.ru.ru", service.castyl("fiz@mail.ru"));
        assertEquals("fiz@mail.com.com", service.castyl("fiz@mail.com"));
        assertEquals("fiz@mail", service.castyl("fiz@mail"));
    }
}
