package ru.mycrg.data_service.service.smev3.request.accept_rnv;

import org.apache.poi.xwpf.usermodel.XWPFDocument;
import ru.mycrg.data_service.accept_rnv_1_0_6.RequestType;

public interface IRnvRequestDocumentCreator {

    int getGoal();

    XWPFDocument create(RequestType request);
}
