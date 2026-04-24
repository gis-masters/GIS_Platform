package ru.mycrg.data_service.util;

import org.junit.Test;
import ru.mycrg.data_service.entity.File;

import static org.junit.Assert.assertEquals;
import static ru.mycrg.data_service.util.FilenameDownloadUtil.defineDownloadFilename;

public class FilenameDownloadUtilTest {

    @Test
    public void shouldUseHeaderFilenameWithFileExtension() {
        String filename = "custom-title";

        assertEquals("custom-title.gml", defineDownloadFilename(filename, prepareFile()));
    }

    @Test
    public void shouldUseFileTitleWhenHeaderFilenameIsEmpty() {
        String filename = "";

        assertEquals("default-title.gml", defineDownloadFilename(filename, prepareFile()));
    }

    @Test
    public void shouldUseFileTitleWhenHeaderFilenameIsBlank() {
        String filename = "   ";

        assertEquals("default-title.gml", defineDownloadFilename(filename, prepareFile()));
    }

    @Test
    public void shouldUseFileTitleWhenHeaderFilenameIsNotProvided() {
        String filename = null;

        assertEquals("default-title.gml", defineDownloadFilename(filename, prepareFile()));
    }

    @Test
    public void shouldAppendFileExtensionToHeaderFilename() {
        String filename = "my.json";

        assertEquals("my.json.gml", defineDownloadFilename(filename, prepareFile()));
    }

    @Test
    public void shouldUseHeaderFilenameWhenExtensionIsNull() {
        String filename = "my.json";

        assertEquals("my.json", defineDownloadFilename(filename, prepareFileNullExtension()));
    }

    @Test
    public void shouldNormalizeHeaderFilenameBeforeAppendingExtension() {
        String filename = "report:<2026>/cadastre\\map?*|\"";

        assertEquals("report_2026_cadastre_map_.gml", defineDownloadFilename(filename, prepareFile()));
    }

    @Test
    public void shouldNormalizeColonHeaderFilename() {
        String filename = ":";

        assertEquals("_.gml", defineDownloadFilename(filename, prepareFile()));
    }

    @Test
    public void shouldKeepLeadingDotHeaderFilename() {
        String filename = ".profile";

        assertEquals(".profile.gml", defineDownloadFilename(filename, prepareFile()));
    }

    @Test
    public void shouldTrimTrailingDotsAndSpacesFromHeaderFilename() {
        String filename = "report. ";

        assertEquals("report.gml", defineDownloadFilename(filename, prepareFile()));
    }

    @Test
    public void shouldNormalizeFileTitleWhenHeaderFilenameIsNotProvided() {
        String filename = null;
        File file = prepareFile("default:title.gml", "gml");

        assertEquals("default_title.gml", defineDownloadFilename(filename, file));
    }

    @Test
    public void shouldUseDefaultFilenameWhenHeaderAndTitleAreNotSuitable() {
        String filename = null;
        File file = prepareFile("..", "gml");

        assertEquals("file", defineDownloadFilename(filename, file));
    }

    @Test
    public void shouldKeepEmojiInHeaderFilename() {
        String filename = "🙃 😑";
        File file = prepareFile("nine.gml", "gml");

        assertEquals("🙃 😑.gml", defineDownloadFilename(filename, file));
    }

    @Test
    public void shouldNormalizeMixedUnicodeFilenameWithForbiddenCharacters() {
        String filename = "Кадастр 🗺️/участок:№42\\финал?. ";

        assertEquals("Кадастр 🗺️_участок_№42_финал_.gml", defineDownloadFilename(filename, prepareFile()));
    }

    @Test
    public void shouldCollapseSeveralForbiddenCharactersIntoSingleSafeCharacter() {
        String filename = "alpha:::beta///gamma\\\\\\delta***";

        assertEquals("alpha_beta_gamma_delta_.gml", defineDownloadFilename(filename, prepareFile()));
    }

    @Test
    public void shouldNormalizeControlCharactersInHeaderFilename() {
        String filename = "line\nbreak\tand\u0000null";

        assertEquals("line_break_and_null.gml", defineDownloadFilename(filename, prepareFile()));
    }

    @Test
    public void shouldNormalizeExtensionBeforeAppendingIt() {
        String filename = "archive📦";
        File file = prepareFile("default-title.gml", "g:ml?");

        assertEquals("archive📦.g_ml_", defineDownloadFilename(filename, file));
    }

    @Test
    public void shouldUseNormalizedTitleWithEmojiWhenHeaderFilenameIsBlank() {
        String filename = "\t";
        File file = prepareFile("title🙃:from/server.gml", "gml");

        assertEquals("title🙃_from_server.gml", defineDownloadFilename(filename, file));
    }

    @Test
    public void shouldUseDefaultFilenameWhenFileHasNoTitleAndExtension() {
        assertEquals("file", defineDownloadFilename(null, new File()));
    }

    @Test
    public void shouldUseDefaultFilenameWhenFileIsNull() {
        assertEquals("file", defineDownloadFilename(null, null));
    }

    @Test
    public void shouldReturnNormalizedHeaderFilenameWhenFileIsNull() {
        assertEquals("report_1_", defineDownloadFilename("report:<1>", null));
    }

    @Test
    public void shouldReturnHeaderFilenameWithoutExtensionWhenFileIsNull() {
        assertEquals("report", defineDownloadFilename("report", null));
    }

    @Test
    public void shouldReturnDefaultFilenameWhenHeaderIsBlankAndFileIsNull() {
        assertEquals("file", defineDownloadFilename("   ", null));
    }

    private File prepareFile() {
        return prepareFile("default-title.gml", "gml");
    }

    private File prepareFile(String title, String extension) {
        File file = new File();
        file.setTitle(title);
        file.setExtension(extension);

        return file;
    }

    private File prepareFileNullExtension() {
        File file = new File();
        file.setTitle("default-title.gml");

        return file;
    }
}
