package unit.smev;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class AMarshallerTest {

    protected String readFile(String path) throws IOException {
        return new String(Files.readAllBytes(Path.of("src/test/resources/xml_smev/" + path)));
    }
}
