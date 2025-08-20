package ru.mycrg.data_service;

import org.junit.Test;
import org.springframework.core.io.FileSystemResource;

import java.io.IOException;

import static java.nio.charset.StandardCharsets.UTF_8;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mozilla.universalchardet.UniversalDetector.detectCharset;

public class EncodingCalculationTest {

    @Test
    public void shouldCorrectDetermineEncodingOfFile() throws IOException {
        assertEquals(UTF_8.toString(),
                     detectCharset(
                             new FileSystemResource("src/test/resources/test_encoding.dxf").getFile()));
    }
}
