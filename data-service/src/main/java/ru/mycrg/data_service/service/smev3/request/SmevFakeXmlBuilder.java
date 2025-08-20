package ru.mycrg.data_service.service.smev3.request;

public class SmevFakeXmlBuilder {

    public static String replaceRequest(String xmlPartOfRequest, String newContent) {
        return xmlPartOfRequest.replaceAll("(?s)<typ:RequestContent>.*?</typ:RequestContent>",
                                           "<typ:RequestContent>\n" + newContent + "\n</typ:RequestContent>");
    }
}
