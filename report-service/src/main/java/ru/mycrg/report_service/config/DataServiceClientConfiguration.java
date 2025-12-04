package ru.mycrg.report_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import ru.mycrg.data_service_client.DataServiceClientFactory;
import ru.mycrg.data_service_client.IDataServiceClient;

@Configuration
public class DataServiceClientConfiguration {

    @Bean
    public IDataServiceClient dataServiceClient(Environment environment) throws Exception {
        String dataServiceUrl = environment.getRequiredProperty("crg-options.data_service_url");

        DataServiceClientFactory.DATA_SERVICES_FACTORY_INSTANCE.setDataServiceUrl(dataServiceUrl);

        return DataServiceClientFactory.DATA_SERVICES_FACTORY_INSTANCE.create();
    }
}
