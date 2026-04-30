package ru.mycrg.cryptopro.service;

import java.util.List;

public interface IVerifier {

    List<VerifyResponse> verify(VerifyRequest request);

    String computeHash(String path);
}
