package ru.mycrg.cryptopro.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.atomic.AtomicReference;

import static java.util.concurrent.TimeUnit.SECONDS;
import static ru.mycrg.cryptopro.service.VerifyResponse.verificationFailed;

@Component
public class ConsoleVerifier implements IVerifier {

    private static final Logger log = LoggerFactory.getLogger(ConsoleVerifier.class);

    private final ExecutorService executor;

    public ConsoleVerifier() {
        int availableProcessors = Runtime.getRuntime().availableProcessors();

        log.debug("Процессоров доступно: {}", availableProcessors);

        this.executor = Executors.newFixedThreadPool(availableProcessors);
    }

    public List<VerifyResponse> verify(VerifyRequest payload) {
        String path = payload.path();
        Path signatureFilePath = null;
        boolean signatureWasCreated = false;

        if (payload.signature() != null) {
            signatureFilePath = Path.of(path + ".sig");
            if (Files.notExists(signatureFilePath)) {
                log.debug("Signature NOT exist: {}", signatureFilePath);

                try {
                    try (FileOutputStream fos = new FileOutputStream(signatureFilePath.toString())) {
                        fos.write(payload.signature().getBytes());
                    }

                    signatureWasCreated = true;
                    log.debug("Создан файл: {}", signatureFilePath);
                } catch (IOException e) {
                    log.error("Не удалось создать файл: {}", signatureFilePath);
                }
            } else {
                log.debug("Signature exist: {}", signatureFilePath);
            }
        }

        try {
            ProcessBuilder builder = new ProcessBuilder();
            builder.directory(new File("/opt"));
            builder.command("sh",
                            "-c",
                            "./cryptcp -verify -nochain -verall -fext .sig -detached " + path);

            Process process = builder.start();

            List<VerifyResponse> responses = new ArrayList<>();
            AtomicReference<VerifyResponse> latest = new AtomicReference<>();
            Future<?> future = executor.submit(
                    new StreamGobbler(process.getInputStream(), line -> handleLine(line, latest, responses)));

            int exitCode = process.waitFor();

            future.get(10, SECONDS);

            if (exitCode == 0) {
                if (signatureWasCreated) {
                    deleteSignature(signatureFilePath);
                }

                return responses;
            }

            String msg = "Не удалось проверить подпись";
            log.error("{} => code: {}", msg, exitCode);

            if (signatureWasCreated) {
                deleteSignature(signatureFilePath);
            }

            return responses;
        } catch (Exception e) {
            String msg = "☠ Что то пошло не так при проверке подписи по запросу: " + payload;
            log.error("{} => {}", msg, e.getMessage(), e);

            if (signatureWasCreated) {
                deleteSignature(signatureFilePath);
            }

            return List.of(verificationFailed(msg));
        }
    }

    @Override
    public String computeHash(String path) {
        Path filePath = Path.of(path);
        if (Files.notExists(filePath)) {
            throw new IllegalStateException("Не найден файл: " + path);
        }

        try {
            ProcessBuilder builder = new ProcessBuilder();
            builder.directory(new File("/opt"));
            builder.command("sh",
                            "-c",
                            "./cryptcp -hash " + path);

            Process process = builder.start();
            int exitCode = process.waitFor();
            if (exitCode == 0) {
                File fileWithHash = new File("/opt/" + filePath.getFileName() + ".hsh");
                try (BufferedReader reader = new BufferedReader(new FileReader(fileWithHash))) {
                    return reader.readLine();
                } catch (Exception e) {
                    log.error("Не удалось прочитать файл: {}", fileWithHash.getAbsolutePath());
                }
            }

            String msg = "Не удалось получить хеш файла";
            log.error("{} => code: {}", msg, exitCode);

            return null;
        } catch (Exception e) {
            String msg = "☠ Что то пошло не так при получении хеша файла: " + path;
            log.error("{} => {}", msg, e.getMessage(), e);

            return "";
        }
    }

    public void handleLine(String line,
                           AtomicReference<VerifyResponse> latest,
                           List<VerifyResponse> responses) {
        log.debug("***   {}", line);

        if (line.contains("Signer: ")) {
            latest.set(new VerifyResponse());
            latest.get()
                  .setSigner(line.replace("Signer: ", ""));

            responses.add(latest.get());
        }

        if (line.contains("Error: ")) {
            latest.get()
                  .setMessage(line.replace("Error: ", ""));
        } else if (line.contains("Signature's verified.")) {
            latest.get().setVerified(true);
        }

        if (line.contains("[ErrorCode:")) {
            String errorCode = line.replace("[ErrorCode: ", "").replace("]", "");
            latest.get()
                  .setCode(errorCode);
            responses.forEach(verifyResponse -> verifyResponse.setCode(errorCode));
        }
    }

    private static void deleteSignature(Path pathToSignature) {
        try {
            Files.delete(pathToSignature);
        } catch (IOException e) {
            log.error("Не удалось подчистить файл подписи: '{}' => {}", pathToSignature, e.getMessage(), e);
        }
    }
}
