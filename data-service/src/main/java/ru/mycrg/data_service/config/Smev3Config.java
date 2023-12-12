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

    @Value("${crg-options.integration.smev3.targetDb}")
    private String targetDb;

    @Value("${crg-options.integration.smev3.s3.endpoint}")
    private String s3endpoint;

    @Value("${crg-options.integration.smev3.s3.accesskey}")
    private String s3accesskey;

    @Value("${crg-options.integration.smev3.s3.secretkey}")
    private String s3secretkey;

    @Value("${crg-options.integration.smev3.s3.bucketOutgoing}")
    private String s3bucketOutgoing;

    @Value("${crg-options.integration.smev3.s3.bucketIncoming}")
    private String s3bucketIncoming;

    public String getMnemonicIS() {
        return mnemonicIS;
    }

    public String getTargetDb() {
        return targetDb;
    }

    public String getS3endpoint() {
        return s3endpoint;
    }

    public String getS3accesskey() {
        return s3accesskey;
    }

    public String getS3secretkey() {
        return s3secretkey;
    }

    public String getS3bucketOutgoing() {
        return s3bucketOutgoing;
    }

    public String getS3bucketIncoming() {
        return s3bucketIncoming;
    }

    public Smev3Config setMnemonicIS(String mnemonicIS) {
        this.mnemonicIS = mnemonicIS;
        return this;
    }
}
