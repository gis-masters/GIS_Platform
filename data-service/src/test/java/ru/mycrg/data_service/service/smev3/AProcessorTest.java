package ru.mycrg.data_service.service.smev3;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class AProcessorTest {

    protected String readFile(String path) throws IOException {
        return new String(Files.readAllBytes(Path.of("src/test/resources/xml_smev/" + path)));
    }
}
