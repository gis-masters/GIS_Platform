package ru.mycrg.gis.unit;

import org.junit.Test;
import ru.mycrg.gis.util.Translit;

import static org.junit.Assert.assertEquals;

public class TranslitTest {

    @Test
    public void shouldCorrectTranslit() {
        assertEquals("Proverka", Translit.doIt("Proverka"));
        assertEquals("additional_test", Translit.doIt("additional test *!"));
        assertEquals("Proverka_s_probelom", Translit.doIt("Проверка с пробелом"));
        assertEquals("Nazvanie__dolzhno__soderzhat_tolko_bukvy_i_cifry",
                Translit.doIt("Название - должно : содержать только буквы и цифры )(№;%%:;?*"));
        assertEquals("Zamenit_probely_nizhnimi_podcherkivaniyami",
                Translit.doIt("Заменить пробелы нижними подчеркиваниями"));
        assertEquals("Bez_myagkogo_i_tverdogo_znaka",
                Translit.doIt("Без мягкого(ь) и твердого(ъ) знака"));
        assertEquals("Proverka314", Translit.doIt("Proverka314"));
        assertEquals("314", Translit.doIt("314"));
    }

}
