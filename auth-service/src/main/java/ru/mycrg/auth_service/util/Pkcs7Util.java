package ru.mycrg.auth_service.util;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.*;
import java.security.cert.CertificateException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import static java.nio.charset.StandardCharsets.UTF_8;

@Component
public class Pkcs7Util {

    private final String PATH_TO_KEYSTORE;
    private final String KEY_PASSWORD;
    private final String KEYSTORE_PASSWORD;
    private final String KEY_ALIAS;
    private final String SIGNATURE_ALG;

    public Pkcs7Util(Environment environment) {
        PATH_TO_KEYSTORE = environment.getRequiredProperty("esia.key-store.path");
        KEYSTORE_PASSWORD = environment.getRequiredProperty("esia.key-store.pass");
        KEY_PASSWORD = environment.getRequiredProperty("esia.key-store.key_pass");
        KEY_ALIAS = environment.getRequiredProperty("esia.key-store.alias");
        SIGNATURE_ALG = environment.getRequiredProperty("esia.key-store.sign_alg");

        BouncyCastleProvider bcProvider = new BouncyCastleProvider();
        String name = bcProvider.getName();
        Security.removeProvider(name); // remove old instance
        Security.addProvider(bcProvider);
    }

    public String sign(String secret) {
        try {
            Signature signer = Signature.getInstance(SIGNATURE_ALG, new BouncyCastleProvider());
            signer.initSign(getPrivateKey());
            signer.update(secret.getBytes(UTF_8));
            byte[] signedBytes = signer.sign();

            return Base64.getUrlEncoder()
                         .encodeToString(signedBytes);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to sign client secret. Reason: " + e.getMessage(), e.getCause());
        }
    }

    private PrivateKey getPrivateKey() {
        try {
            KeyStore keyStore = KeyStore.getInstance("JKS");
            InputStream is = new FileInputStream(PATH_TO_KEYSTORE);
            keyStore.load(is, KEYSTORE_PASSWORD.toCharArray());

            java.security.cert.Certificate[] certificateChain = keyStore.getCertificateChain(KEY_ALIAS);
            List<java.security.cert.Certificate> certificates = new ArrayList<>();
            for (int i = 0, length = certificateChain == null ? 0 : certificateChain.length; i < length; i++) {
                certificates.add(certificateChain[i]);
            }

            Key privateKey = keyStore.getKey(KEY_ALIAS, KEY_PASSWORD.toCharArray());
            if (privateKey == null) {
                throw new IllegalStateException("Failed to get the secret key by alias: " + KEY_ALIAS);
            }

            return (PrivateKey) privateKey;
        } catch (IOException e) {
            throw new IllegalStateException("Failed to get private key from key storage by path: " + PATH_TO_KEYSTORE);
        } catch (CertificateException e) {
            throw new IllegalStateException("Failed to get certificate from file: " + PATH_TO_KEYSTORE);
        } catch (KeyStoreException e) {
            throw new IllegalStateException("Failed to get key store instance by name JKS");
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("Failed to get private key from key storage. Incorrect sign algorithm?");
        } catch (UnrecoverableKeyException e) {
            throw new IllegalStateException("Failed to get private key from key storage. Unrecoverable key?");
        }
    }
}
