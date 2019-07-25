package ru.mycrg.gis.unit;

import org.junit.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import ru.mycrg.common.crypt.AES;
import ru.mycrg.gis.util.Translit;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.Base64;

import static org.junit.Assert.assertEquals;

public class TranslitTest {

    private static SecretKeySpec secretKey;
    private static byte[] key;

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

    @Test
    public void shouldEncryptText() {
        assertEquals("secure text", AES.decrypt(AES.encrypt("secure text", "salt"), "salt"));
    }

}
