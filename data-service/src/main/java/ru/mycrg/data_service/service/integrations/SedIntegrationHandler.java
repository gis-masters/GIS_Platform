package ru.mycrg.data_service.service.integrations;

import okhttp3.OkHttpClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dto.record.RecordEntity;
import ru.mycrg.data_service.service.storage.FileStorageService;

import java.net.MalformedURLException;
import java.net.URL;

@Service
public class SedIntegrationHandler implements IIntegrationHandler {

    private final Logger log = LoggerFactory.getLogger(SedIntegrationHandler.class);

    private final URL sedUrl;
    private final OkHttpClient httpClient;
    private final FileStorageService fileStorageService;

    public SedIntegrationHandler(Environment environment,
                                 FileStorageService fileStorageService) throws MalformedURLException {
        this.sedUrl = new URL(environment.getRequiredProperty("crg-options.integration.sed-url"));
        this.httpClient = new OkHttpClient();

        this.fileStorageService = fileStorageService;
    }

    @Override
    public void execute(RecordEntity record) throws InterruptedException {
        log.debug("Try send to SED by URL: {}", sedUrl);

        // Предлагаю вот так вот его и оставить и воскресить только тогда, когда понадобится
//        try {
//            Resource resource = fileStorageService.loadAsResource(record.getInnerPath());
//
//            RequestBody file = RequestBody.create(MediaType.parse(""), resource.getFile());
//
//            MultipartBody payload = new MultipartBody.Builder()
//                    .addFormDataPart("file", record.getTitle(), file)
//                    .addFormDataPart("data", record.toString())
//                    .build();
//
//            Request request = new Request.Builder().url(sedUrl)
//                                                   .post(payload)
//                                                   .build();
//
//            Response response = httpClient.newCall(request).execute();
//            if (!response.isSuccessful()) {
//                throw new InterruptedException();
//            }
//        } catch (Exception e) {
        throw new InterruptedException();
//        }
    }

    @Override
    public String getType() {
        return "SED";
    }
}
