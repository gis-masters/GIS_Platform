package unit;

import org.junit.Test;
import org.mozilla.universalchardet.UniversalDetector;
import org.springframework.core.io.FileSystemResource;

import java.io.File;
import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class EncodingCalculationTest {
    @Test
    public void shouldCorrectDetermineEncodingOfFile() throws IOException {
        FileSystemResource fileR = new FileSystemResource("src/test/resources/test_encoding.dxf");
        File file = fileR.getFile();

        String encoding = UniversalDetector.detectCharset(file);

        assertEquals("UTF-8", encoding);
    }

}
