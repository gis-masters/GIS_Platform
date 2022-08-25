package unit;

import org.junit.Test;
import org.springframework.util.StringUtils;
import ru.mycrg.data_service.exceptions.TransformationException;
import ru.mycrg.data_service.util.CrsHandler;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static ru.mycrg.data_service.util.EcqlRecordIdHandler.joinAsIn;

public class EcqlRecordIdTest {

    @Test
    public void shouldCorrectBuildFilter() {
        assertEquals("(((is_folder = false) OR is_folder IS NULL) AND (\"id\" IN(314,1,5431)))",
                     joinAsIn("((is_folder = false) OR is_folder IS NULL)", List.of(314L, 1L, 5431L)));
    }

    @Test
    public void shouldCorrectBuildFilter_ecqlFilterNull_IdsNull() {
        assertEquals("", joinAsIn(null, null));
    }

    @Test
    public void shouldCorrectBuildFilter_ecqlFilterNull() {
        assertEquals("(\"id\" IN(314,1,5431))",
                     joinAsIn(null, List.of(314L, 1L, 5431L)));
    }

    @Test
    public void shouldCorrectBuildFilter_ecqlFilterBlank() {
        assertEquals("(\"id\" IN(314,1,5431))",
                     joinAsIn("", List.of(314L, 1L, 5431L)));
    }

    @Test
    public void shouldCorrectBuildFilter_idsNull() {
        assertEquals("(((is_folder = false) OR is_folder IS NULL))",
                     joinAsIn("(((is_folder = false) OR is_folder IS NULL))", null));
    }

    @Test
    public void shouldCorrectBuildFilter_ecqlFilterNull_idsEmpty() {
        assertEquals("", joinAsIn(null, new ArrayList<>()));
    }
}
