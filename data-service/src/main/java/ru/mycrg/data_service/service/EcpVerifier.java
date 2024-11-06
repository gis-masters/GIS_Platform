package ru.mycrg.data_service.service;

import com.fasterxml.jackson.core.type.TypeReference;
import okhttp3.*;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import ru.mycrg.common_contracts.generated.ecp.VerifyEcpResponse;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.http_client.HttpClient;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.handlers.BaseRequestHandler;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;

import static ru.mycrg.common_contracts.generated.ecp.VerifyEcpResponse.verificationFailed;

@Component
public class EcpVerifier {

    private static final Logger log = LoggerFactory.getLogger(EcpVerifier.class);

    private final HttpClient httpClient;
    private final URL cryptoproServiceVerifyUrl;
    private final URL cryptoproServiceHashUrl;

    public EcpVerifier(Environment env) throws MalformedURLException {
        httpClient = new HttpClient(new BaseRequestHandler(new OkHttpClient()));
        cryptoproServiceVerifyUrl = new URL(env.getRequiredProperty("crg-options.cryptopro-service-url") + "/verify");
        cryptoproServiceHashUrl = new URL(env.getRequiredProperty("crg-options.cryptopro-service-url") + "/hash");
    }

    @NotNull
    public List<VerifyEcpResponse> verify(String path, byte[] ecpAsBytes) {
        try {
            RequestBody ecp = RequestBody.create(MediaType.parse("application/octet-stream"), ecpAsBytes);
            RequestBody payload = new MultipartBody.Builder()
                    .setType(MultipartBody.FORM)
                    .addFormDataPart("path", path)
                    .addFormDataPart("signature", "blackLivesMatter.sig", ecp)
                    .build();

            Request request = new Request.Builder()
                    .url(cryptoproServiceVerifyUrl)
                    .post(payload)
                    .build();

            ResponseModel<List<VerifyEcpResponse>> responseModel = httpClient.handleRequest(request,
                                                                                            new TypeReference<>() {
                                                                                            });
            if (responseModel.isSuccessful()) {
                return responseModel.getBody() != null ? responseModel.getBody() : List.of();
            } else {
                log.debug("Не удалось проверить подпись. Неожиданный ответ от сервиса: {}", responseModel);

                return List.of(verificationFailed("Сервис проверки подписи не доступен"));
            }
        } catch (Exception e) {
            String msg = "Не удалось проверить подпись";
            log.error("{} => {}", msg, e.getMessage(), e);

            return List.of(verificationFailed(msg));
        }
    }

    public String calculateHash(String path) {
        try {
            RequestBody payload = new MultipartBody.Builder()
                    .setType(MultipartBody.FORM)
                    .addFormDataPart("path", path)
                    .build();

            Request request = new Request.Builder()
                    .url(cryptoproServiceHashUrl)
                    .post(payload)
                    .build();

            ResponseModel<String> responseModel = httpClient.handleRequestAsString(request);
            if (responseModel.isSuccessful()) {
                return responseModel.getBody();
            } else {
                log.debug("Не удалось получить хеш для файла: [{}]. Неожиданный ответ от сервиса: {}",
                          path, responseModel);
            }
        } catch (Exception e) {
            String msg = "Не удалось проверить подпись";
            log.error("{} => {}", msg, e.getMessage(), e);
        }

        throw new DataServiceException("Не удалось получить хеш");
    }
}
