package ru.mycrg.report_service.config;

import io.carbone.CarboneException;
import io.carbone.CarboneServicesFactory;
import io.carbone.ICarboneServices;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

@Configuration
public class CarboneServiceConfiguration {

    @Bean
    public ICarboneServices carboneServices(Environment environment) throws CarboneException {
        String carboneUrl = environment.getRequiredProperty("crg-options.carbone_url");
        
        CarboneServicesFactory.CARBONE_SERVICES_FACTORY_INSTANCE.SetCarboneUrl(carboneUrl);
        
        return CarboneServicesFactory.CARBONE_SERVICES_FACTORY_INSTANCE.create("");
    }
}
