package ru.mycrg.report_service.config;

import io.carbone.CarboneException;
import io.carbone.CarboneServicesFactory;
import io.carbone.ICarboneServices;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CarboneServiceConfiguration {

    @Bean
    public ICarboneServices carboneServices(@Value("${crg-options.carbone.url}") String carboneUrl)
            throws CarboneException {
        CarboneServicesFactory.CARBONE_SERVICES_FACTORY_INSTANCE.SetCarboneUrl(carboneUrl);

        return CarboneServicesFactory.CARBONE_SERVICES_FACTORY_INSTANCE.create("");
    }
}
