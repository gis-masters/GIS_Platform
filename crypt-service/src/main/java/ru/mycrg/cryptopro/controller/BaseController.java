package ru.mycrg.cryptopro.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.cryptopro.service.ConsoleVerifier;
import ru.mycrg.cryptopro.service.IVerifier;
import ru.mycrg.cryptopro.service.VerifyRequest;
import ru.mycrg.cryptopro.service.VerifyResponse;

import java.util.List;

@RestController
public class BaseController {

    private final IVerifier consoleVerifier;

    public BaseController(ConsoleVerifier consoleVerifier) {
        this.consoleVerifier = consoleVerifier;
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestParam(value = "signature", required = false) MultipartFile signature,
                                    @RequestParam("path") String path) {
        List<VerifyResponse> response = consoleVerifier.verify(new VerifyRequest(path, signature));

        return ResponseEntity.ok(response);
    }

    @PostMapping("/hash")
    public ResponseEntity<?> computeHash(@RequestParam("path") String path) {
        String hash = consoleVerifier.computeHash(path);

        return ResponseEntity.ok(hash);
    }
}
