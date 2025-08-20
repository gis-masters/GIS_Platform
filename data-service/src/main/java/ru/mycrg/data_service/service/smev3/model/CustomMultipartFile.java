package ru.mycrg.data_service.service.smev3.model;

import org.apache.commons.io.FileUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;

public class CustomMultipartFile implements MultipartFile {

    private byte[] inputBytes;
    private String name;
    private String originalName;
    private String contentType;

    public CustomMultipartFile(byte[] inputBytes, String name, String originalName, String contentType) {
        this.inputBytes = inputBytes;
        this.name = name;
        this.originalName = originalName;
        this.contentType = contentType;
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public String getOriginalFilename() {
        return originalName;
    }

    @Override
    public String getContentType() {
        return contentType;
    }

    @Override
    public boolean isEmpty() {
        return inputBytes == null || inputBytes.length == 0;
    }

    @Override
    public long getSize() {
        return inputBytes.length;
    }

    @Override
    public byte[] getBytes() {
        return inputBytes;
    }

    @Override
    public InputStream getInputStream() {
        return new ByteArrayInputStream(inputBytes);
    }

    @Override
    public void transferTo(File destination) throws IOException, IllegalStateException {
        FileUtils.writeByteArrayToFile(destination, inputBytes);
    }
}
