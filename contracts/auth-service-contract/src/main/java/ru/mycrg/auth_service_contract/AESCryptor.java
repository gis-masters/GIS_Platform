package ru.mycrg.auth_service_contract;

import javax.crypto.Cipher;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Base64;

import static java.nio.charset.StandardCharsets.UTF_8;

public class AESCryptor {

    private static final int GCM_IV_LENGTH = 12;
    private static final int GCM_TAG_LENGTH = 16;

    private final Cipher cipher;
    private final SecretKey secretKey;

    public AESCryptor(String secret) throws NoSuchPaddingException, NoSuchAlgorithmException {
        secretKey = getKeySpec(secret);
        cipher = Cipher.getInstance("AES/GCM/NoPadding");
    }

    public String encrypt(String privateString) {
        try {
            byte[] iv = new byte[GCM_IV_LENGTH];
            (new SecureRandom()).nextBytes(iv);

            GCMParameterSpec ivSpec = new GCMParameterSpec(GCM_TAG_LENGTH * Byte.SIZE, iv);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, ivSpec);

            byte[] ciphertext = cipher.doFinal(privateString.getBytes(UTF_8));
            byte[] encrypted = new byte[iv.length + ciphertext.length];
            System.arraycopy(iv, 0, encrypted, 0, iv.length);
            System.arraycopy(ciphertext, 0, encrypted, iv.length, ciphertext.length);

            return Base64.getEncoder()
                         .encodeToString(encrypted);
        } catch (Exception e) {
            throw new RuntimeException("encrypt failed: " + e.getMessage(), e.getCause());
        }
    }

    public String decrypt(String encrypted) {
        try {
            byte[] decoded = Base64.getDecoder().decode(encrypted);

            byte[] iv = Arrays.copyOfRange(decoded, 0, GCM_IV_LENGTH);

            GCMParameterSpec ivSpec = new GCMParameterSpec(GCM_TAG_LENGTH * Byte.SIZE, iv);
            cipher.init(Cipher.DECRYPT_MODE, secretKey, ivSpec);

            byte[] ciphertext = cipher.doFinal(decoded, GCM_IV_LENGTH, decoded.length - GCM_IV_LENGTH);

            return new String(ciphertext, UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("decrypt failed: " + e.getMessage(), e.getCause());
        }
    }

    private SecretKeySpec getKeySpec(String secret) {
        return new SecretKeySpec(Arrays.copyOf(secret.getBytes(), 16), "AES");
    }
}
