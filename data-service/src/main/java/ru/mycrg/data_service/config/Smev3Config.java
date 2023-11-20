package ru.mycrg.data_service.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;


/**
 * Параметры интеграци с СМЭВ 3
 */
@Configuration
public class Smev3Config {

    @Value("${crg-options.integration.smev3.mnemonic}")
    private String mnemonicIS;

    @Value("${crg-options.integration.smev3.amqp.host}")
    private String amqpHost;

    @Value("${crg-options.integration.smev3.amqp.username}")
    private String amqpUsername;

    @Value("${crg-options.integration.smev3.amqp.password}")
    private String amqpPassword;

    public String getMnemonicIS() {
        return mnemonicIS;
    }

    public String getAmqpHost() {
        return amqpHost;
    }

    public String getAmqpUsername() {
        return amqpUsername;
    }

    public String getAmqpPassword() {
        return amqpPassword;
    }

    public Smev3Config setMnemonicIS(String mnemonicIS) {
        this.mnemonicIS = mnemonicIS;
        return this;
    }
}
