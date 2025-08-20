package ru.mycrg.data_service.service.ecp;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import ru.mycrg.common_contracts.generated.ecp.VerifyEcpResponse;
import ru.mycrg.data_service.entity.File;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.ErrorInfo;

import javax.transaction.Transactional;
import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class FileSigner {

    private static final Logger log = LoggerFactory.getLogger(FileSigner.class);

    private final EcpVerifier ecpVerifier;

    public FileSigner(EcpVerifier ecpVerifier) {
        this.ecpVerifier = ecpVerifier;
    }

    @Transactional
    public void sign(File file, MultipartFile ecp) {
        byte[] ecpAsBytes = getEcpAsBytes(ecp);

        // Проверим новую подпись
        String errorMsg = "Новая ЭЦП не прошла проверку";
        List<VerifyEcpResponse> newEcpVerifyResponse = throwIfSignNotValid(file, ecpAsBytes, errorMsg);

        if (file.getEcp() != null) {
            log.debug("Файл подписан. Проверяем, что новая подпись соответствует критериям: \n" +
                              "- Новая подпись валидна\n" +
                              "- Новая подпись содержит подписанта(ов) из старой подписи\n" +
                              "- Новая подпись содержит нового подписанта");

            // На всякий случай проверим старую подпись
            String error = "Существующая подпись файла не прошла проверку";
            List<VerifyEcpResponse> oldEcpVerifyResponse = throwIfSignNotValid(file, file.getEcp(), error);

            log.info("oldEcpVerifyResponse: {}", oldEcpVerifyResponse);
            log.info("newEcpVerifyResponse: {}", newEcpVerifyResponse);

            // Предполагаем, что новая подпись точно должна содержать большее коло-во подписантов
            if (newEcpVerifyResponse.size() <= oldEcpVerifyResponse.size()) {
                throw new BadRequestException("Новая подпись не содержит новых подписантов");
            }

            // Все старые подписанты есть в новой подписи
            Set<String> newSigners = newEcpVerifyResponse.stream()
                                                         .map(VerifyEcpResponse::getSigner)
                                                         .collect(Collectors.toSet());

            boolean containAllOldSigners = oldEcpVerifyResponse.stream()
                                                               .map(VerifyEcpResponse::getSigner)
                                                               .allMatch(newSigners::contains);
            if (!containAllOldSigners) {
                throw new BadRequestException("Новая подпись не содержит всех старых подписантов");
            }
        }

        file.setEcp(ecpAsBytes);
        log.debug("Файл: '{}' подписан: {}", file.getId(), newEcpVerifyResponse);
    }

    private List<VerifyEcpResponse> throwIfSignNotValid(File file, byte[] signAsBytes, String errorMsg) {
        List<VerifyEcpResponse> result = ecpVerifier.verify(file.getPath(), signAsBytes);
        if (!isVerified(result)) {
            List<ErrorInfo> errors = result
                    .stream()
                    .filter(ecpResponse -> !ecpResponse.isVerified())
                    .map(ecpResponse -> new ErrorInfo(ecpResponse.getSigner(), ecpResponse.getCode()))
                    .collect(Collectors.toList());

            throw new BadRequestException(errorMsg, errors);
        }

        return result;
    }

    private static byte @NotNull [] getEcpAsBytes(MultipartFile sign) {
        try {
            return sign.getBytes();
        } catch (IOException e) {
            String msg = "Не удалось считать подпись";
            log.error("{} => {}", msg, e.getMessage(), e);

            throw new DataServiceException(msg);
        }
    }

    private boolean isVerified(List<VerifyEcpResponse> verifyEcpResponses) {
        return verifyEcpResponses.stream().allMatch(VerifyEcpResponse::isVerified);
    }
}
