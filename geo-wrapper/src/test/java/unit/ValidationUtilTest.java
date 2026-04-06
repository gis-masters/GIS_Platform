package unit;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static ru.mycrg.wrapper.service.util.StringDecoder.decode;

public class ValidationUtilTest {

    @Test
    public void shouldTestEncoding() {
        String windows1251 = "Ð¡Ñ\u0080ÐµÐ´Ð½ÐµÑ\u008DÑ\u0082Ð°Ð¶ÐºÐ° - Ð³Ð´Ðµ ÐµÑ\u0081Ñ\u0082Ñ\u008C,, " +
                "Ð¼Ð°Ð»Ð¾Ñ\u008DÑ\u0082Ð°Ð¶ÐºÐ° Ð³Ð´Ðµ Ð¼Ð¾Ð¶Ð½Ð¾";

        assertEquals("Среднеэтажка - где есть,, малоэтажка где можно", decode(windows1251));
        assertEquals("Корректный UTF-8 текст.", decode("Корректный UTF-8 текст."));
        assertEquals("", decode(""));
        assertEquals("{\"text\":\"Регламенты\"}", decode("{\"text\":\"Регламенты\"}"));
        assertEquals("{можно}", decode("{Ð¼Ð¾Ð¶Ð½Ð¾}"));
        assertEquals("ООО «НТО»", decode("ООО «НТО»"));
    }
}
