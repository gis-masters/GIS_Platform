package ru.mycrg.gis.util;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class Util {

    public static Map<String, Object> getRandomOrganization() {
        String[] split = UUID.randomUUID().toString().split("-");

        Map<String, Object> organization = new HashMap<>();
        organization.put("email", split[0] + "@rnd.com");
        organization.put("name", "organization name: " + split[1]);
        organization.put("password", "passSTRONG314:" +  split[2]);
        organization.put("phone", "+7(978)111 11 11");
        organization.put("userName", "userName");
        organization.put("userSurName", "userSurName");

        return organization;
    }
}
