package ru.mycrg.auth_service_contract.dto.esia;

public class EsiaUserInfo {

    private String id;
    private String sbjId;
    private String firstName;
    private String lastName;
    private String middleName;
    private String eMail;

    public EsiaUserInfo() {
        // Required
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSbjId() {
        return sbjId;
    }

    public void setSbjId(String sbjId) {
        this.sbjId = sbjId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getMiddleName() {
        return middleName;
    }

    public void setMiddleName(String middleName) {
        this.middleName = middleName;
    }

    public String getEmail() {
        return eMail;
    }

    public void setEmail(String eMail) {
        this.eMail = eMail;
    }

    @Override
    public String toString() {
        return "{" +
                "\"id\":" + (id == null ? "null" : "\"" + id + "\"") + ", " +
                "\"sbjId\":" + (sbjId == null ? "null" : "\"" + sbjId + "\"") + ", " +
                "\"firstName\":" + (firstName == null ? "null" : "\"" + firstName + "\"") + ", " +
                "\"lastName\":" + (lastName == null ? "null" : "\"" + lastName + "\"") + ", " +
                "\"middleName\":" + (middleName == null ? "null" : "\"" + middleName + "\"") + ", " +
                "\"eMail\":" + (eMail == null ? "null" : "\"" + eMail + "\"") +
                "}";
    }
}
