package ru.mycrg.data_service.service.smev3.request.accept_rns;

import org.apache.poi.xwpf.usermodel.XWPFDocument;
import ru.mycrg.data_service.accept_rns_1_0_3.RequestType;

public interface IRnsRequestDocumentCreator {

    int getGoal();

    XWPFDocument create(RequestType request);
}
