package ru.mycrg.cryptopro.service;

import org.springframework.web.multipart.MultipartFile;

public record VerifyRequest(String path, MultipartFile signature) {

}
