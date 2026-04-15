package ru.mycrg.hash_generator;

import org.jasypt.digest.StandardStringDigester;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public final class Main {

    private static final String DIGEST1_PREFIX = "digest1:";
    private static final String DIGEST1_ALGORITHM = "SHA-256";
    private static final int DIGEST1_SALT_SIZE_BYTES = 16;
    private static final int DIGEST1_ITERATIONS = 100000;

    private Main() {
    }

    /**
     * Usage:
     * docker run --rm gismaster/gis-platform-ph "mypassword"
     */
    public static void main(String[] args) {
        if (args.length != 1 || args[0].isBlank()) {
            System.err.println("Usage: docker run --rm gismaster/gis-platform-ph \"plain-text-password\"");
            System.exit(1);
        }

        String password = args[0];
        BCryptPasswordEncoder bCryptEncoder = new BCryptPasswordEncoder();

        System.out.println(bCryptEncoder.encode(password));
        System.out.println(DIGEST1_PREFIX + generateDigest1(password));
    }

    private static String generateDigest1(String password) {
        StandardStringDigester digester = new StandardStringDigester();
        digester.setAlgorithm(DIGEST1_ALGORITHM);
        digester.setSaltSizeBytes(DIGEST1_SALT_SIZE_BYTES);
        digester.setIterations(DIGEST1_ITERATIONS);
        digester.setStringOutputType(StandardStringDigester.DEFAULT_STRING_OUTPUT_TYPE);

        return digester.digest(password);
    }
}
