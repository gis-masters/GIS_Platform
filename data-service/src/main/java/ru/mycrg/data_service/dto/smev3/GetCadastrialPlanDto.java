package ru.mycrg.data_service.dto.smev3;

public class GetCadastrialPlanDto implements ISmevRequestDto {
    private String requestFilename;
    private String appFilename;
    private String passportFilename;
    private String archiveFilename;

    public String getRequestFilename() {
        return requestFilename;
    }

    public GetCadastrialPlanDto setRequestFilename(String requestFilename) {
        this.requestFilename = requestFilename;
        return this;
    }

    public String getAppFilename() {
        return appFilename;
    }

    public GetCadastrialPlanDto setAppFilename(String appFilename) {
        this.appFilename = appFilename;
        return this;
    }

    public String getPassportFilename() {
        return passportFilename;
    }

    public GetCadastrialPlanDto setPassportFilename(String passportFilename) {
        this.passportFilename = passportFilename;
        return this;
    }

    public String getArchiveFilename() {
        return archiveFilename;
    }

    public GetCadastrialPlanDto setArchiveFilename(String archiveFilename) {
        this.archiveFilename = archiveFilename;
        return this;
    }

    //todo заглушка
    @Override
    public Boolean sendToSmev() {
        return true;
    }
}
