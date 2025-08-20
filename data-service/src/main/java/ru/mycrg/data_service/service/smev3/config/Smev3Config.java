package ru.mycrg.data_service.service.smev3.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

/**
 * Параметры интеграции с СМЭВ 3
 */
@Configuration
public class Smev3Config {

    @Value("${crg-options.integration.smev3.mnemonic}")
    private String systemMnemonic;

    @Value("${crg-options.integration.smev3.transportMnemonic}")
    private String transportMnemonic;

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

    public String getSystemMnemonic() {
        return systemMnemonic;
    }

    public Smev3Config setSystemMnemonic(String systemMnemonic) {
        this.systemMnemonic = systemMnemonic;
        return this;
    }

    public String getTransportMnemonic() {
        return transportMnemonic;
    }

    public Smev3Config setTransportMnemonic(String transportMnemonic) {
        this.transportMnemonic = transportMnemonic;
        return this;
    }

    public String getTargetDb() {
        return targetDb;
    }

    public Smev3Config setTargetDb(String targetDb) {
        this.targetDb = targetDb;
        return this;
    }

    public String getS3endpoint() {
        return s3endpoint;
    }

    public Smev3Config setS3endpoint(String s3endpoint) {
        this.s3endpoint = s3endpoint;
        return this;
    }

    public String getS3accesskey() {
        return s3accesskey;
    }

    public Smev3Config setS3accesskey(String s3accesskey) {
        this.s3accesskey = s3accesskey;
        return this;
    }

    public String getS3secretkey() {
        return s3secretkey;
    }

    public Smev3Config setS3secretkey(String s3secretkey) {
        this.s3secretkey = s3secretkey;
        return this;
    }

    public String getS3bucketOutgoing() {
        return s3bucketOutgoing;
    }

    public Smev3Config setS3bucketOutgoing(String s3bucketOutgoing) {
        this.s3bucketOutgoing = s3bucketOutgoing;
        return this;
    }

    public String getS3bucketIncoming() {
        return s3bucketIncoming;
    }

    public Smev3Config setS3bucketIncoming(String s3bucketIncoming) {
        this.s3bucketIncoming = s3bucketIncoming;
        return this;
    }
}
