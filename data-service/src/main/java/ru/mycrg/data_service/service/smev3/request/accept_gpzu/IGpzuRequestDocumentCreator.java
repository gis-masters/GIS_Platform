package ru.mycrg.data_service.service.smev3.request.accept_gpzu;

import org.apache.poi.xwpf.usermodel.XWPFDocument;
import ru.mycrg.data_service.gpzu_1_0_1.RequestType;

public interface IGpzuRequestDocumentCreator {

    int getGoal();

    XWPFDocument create(RequestType request);
}
