package ru.mycrg.cryptopro;

import org.junit.jupiter.api.Test;
import ru.mycrg.cryptopro.service.ConsoleVerifier;
import ru.mycrg.cryptopro.service.VerifyResponse;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class ConsoleVerifierTest {

    @Test
    void shouldCorrectlyVerifyMultipleSignature() {
        List<String> consoleOutput = List.of(
                "CryptCP 5.0 (c) Crypto-Pro, 2002-2024.",
                "Command prompt Utility for file signature and encryption.",
                "Folder '/opt/file_storage/organization_6/library_record/dl_default/':",
                "/opt/file_storage/organization_6/library_record/dl_default/7_some_files__507639498.xml... Signature verifying",
                "Signer: Test Certificate",
                " Signature's verified.",
                "Signer: Майер Виктория Николаевна, RU, 910305832928, zolotareva2004@list.ru",
                " Signature's verified.",
                "[ErrorCode: 0x00000000]"
        );

        ConsoleVerifier verifier = new ConsoleVerifier();
        List<VerifyResponse> result = new ArrayList<>();
        AtomicReference<VerifyResponse> latest = new AtomicReference<>();

        consoleOutput.forEach(line -> verifier.handleLine(line, latest, result));

        assertTrue(result.size() > 1);

        VerifyResponse first = result.getFirst();
        assertEquals("Test Certificate", first.getSigner());
        assertEquals("0x00000000", first.getCode());

        VerifyResponse last = result.getLast();
        assertEquals("Майер Виктория Николаевна, RU, 910305832928, zolotareva2004@list.ru", last.getSigner());
        assertEquals("0x00000000", last.getCode());
    }
}
