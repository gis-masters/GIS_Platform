package ru.mycrg.data_service.service.ecp;

import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.http_client.HttpClient;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.handlers.BaseRequestHandler;

import java.net.MalformedURLException;
import java.net.URL;

@Component
public class HashCalculator {

    private static final Logger log = LoggerFactory.getLogger(HashCalculator.class);

    private final HttpClient httpClient;
    private final URL cryptoproServiceHashUrl;

    public HashCalculator(Environment env) throws MalformedURLException {
        httpClient = new HttpClient(new BaseRequestHandler(new OkHttpClient()));
        cryptoproServiceHashUrl = new URL(env.getRequiredProperty("crg-options.cryptopro-service-url") + "/hash");
    }

    public String calculate(String path) {
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
