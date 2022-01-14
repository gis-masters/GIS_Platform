package ru.mycrg.auth_service.service;

import org.bouncycastle.cert.jcajce.JcaCertStore;
import org.bouncycastle.cms.*;
import org.bouncycastle.cms.jcajce.JcaSignerInfoGeneratorBuilder;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.operator.ContentSigner;
import org.bouncycastle.operator.DigestCalculatorProvider;
import org.bouncycastle.operator.jcajce.JcaContentSignerBuilder;
import org.bouncycastle.operator.jcajce.JcaDigestCalculatorProviderBuilder;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Component
public class Pkcs7Util {

    private final String PATH_TO_KEYSTORE;
    private final String KEYSTORE_PASSWORD;
    private final String KEY_ALIAS;
    private final String SIGNATURE_ALG;

    public Pkcs7Util(Environment environment) {
        PATH_TO_KEYSTORE = environment.getRequiredProperty("esia.key-store.path");
        KEYSTORE_PASSWORD = environment.getRequiredProperty("esia.key-store.pass");
        KEY_ALIAS = environment.getRequiredProperty("esia.key-store.alias");
        SIGNATURE_ALG = environment.getRequiredProperty("esia.key-store.sign_alg");

        BouncyCastleProvider bcProvider = new BouncyCastleProvider();
        String name = bcProvider.getName();
        Security.removeProvider(name); // remove old instance
        Security.addProvider(bcProvider);
    }

    public String generateClientSecret(String scope, String timestamp, String clientId, String state) {
        try {
            String secret = scope + timestamp + clientId + state;

            KeyStore keyStore = getKeyStore();
            CMSSignedDataGenerator signedDataGenerator = setUpProvider(keyStore);
            byte[] signedBytes = signPkcs7(secret.getBytes(StandardCharsets.UTF_8), signedDataGenerator);

            return new String(Base64.getUrlEncoder().encode(signedBytes));
        } catch (Exception e) {
            throw new IllegalStateException("Failed to generate client secret. Reason: " + e.getMessage(),
                                            e.getCause());
        }
    }

    private KeyStore getKeyStore() throws KeyStoreException, IOException, NoSuchAlgorithmException,
                                          CertificateException {
        KeyStore keystore = KeyStore.getInstance("JKS");
        InputStream is = new FileInputStream(PATH_TO_KEYSTORE);
        keystore.load(is, KEYSTORE_PASSWORD.toCharArray());

        return keystore;
    }

    private CMSSignedDataGenerator setUpProvider(KeyStore keystore) throws Exception {
        java.security.cert.Certificate[] certificateChain = keystore.getCertificateChain(KEY_ALIAS);
        List<java.security.cert.Certificate> certificates = new ArrayList<>();

        for (int i = 0, length = certificateChain == null ? 0 : certificateChain.length; i < length; i++) {
            certificates.add(certificateChain[i]);
        }

        Key key = keystore.getKey(KEY_ALIAS, KEYSTORE_PASSWORD.toCharArray());
        if (key == null) {
            throw new IllegalStateException("Failed to get the secret key by alias: " + KEY_ALIAS);
        }

        ContentSigner signer = new JcaContentSignerBuilder(SIGNATURE_ALG)
                .setProvider("BC")
                .build((PrivateKey) key);
        java.security.cert.Certificate cert = keystore.getCertificate(KEY_ALIAS);
        DigestCalculatorProvider provider = new JcaDigestCalculatorProviderBuilder().setProvider("BC").build();
        SignerInfoGenerator bc = new JcaSignerInfoGeneratorBuilder(provider).build(signer, (X509Certificate) cert);

        CMSSignedDataGenerator generator = new CMSSignedDataGenerator();
        generator.addSignerInfoGenerator(bc);
        generator.addCertificates(new JcaCertStore(certificates));

        return generator;
    }

    private byte[] signPkcs7(byte[] content, CMSSignedDataGenerator generator) throws CMSException, IOException {
        CMSTypedData cmsTypedData = new CMSProcessableByteArray(content);
        CMSSignedData signedData = generator.generate(cmsTypedData, true);

        return signedData.getEncoded();
    }
}
