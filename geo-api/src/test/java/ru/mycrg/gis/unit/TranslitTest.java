package ru.mycrg.gis.unit;

import org.junit.Test;
import ru.mycrg.common.ValidationMqResponse;
import ru.mycrg.common.enums.ProcessStatus;
import ru.mycrg.gis.dto.ValidationRequestDto;
import ru.mycrg.gis.dto.ValidationResponseDto;
import ru.mycrg.gis.service.validation.ValidationProcess;
import ru.mycrg.gis.util.Translit;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class TranslitTest {

    @Test
    public void shouldCorrectTranslit() {
        assertEquals("Proverka_s_probelom", Translit.doIt("Проверка с пробелом"));
        assertEquals("Nazvanie__dolzhno__soderzhat_tolko_bukvy_i_cifry",
                Translit.doIt("Название - должно : содержать только буквы и цифры )(№;%%:;?*"));
        assertEquals("Zamenit_probely_nizhnimi_podcherkivaniyami",
                Translit.doIt("Заменить пробелы нижними подчеркиваниями"));
        assertEquals("Bez_myagkogo_i_tverdogo_znaka",
                Translit.doIt("Без мягкого(ь) и твердого(ъ) знака"));
    }

}
