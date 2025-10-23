# Memo on the file `.env.example`

This document describes all the variables of the environment necessary for the correct operation of the application. Do not add and do not remove variables without obvious need — Follow the instructions below.

---

## 📋 The structure of the variables

### 1. Administrative passwords
```
SYSTEM_ADMIN_PASSWORD
SPRING_FLYWAY_PLACEHOLDERS_ADMIN_PASSWORD
CRG_OPTIONS_SYSTEM_ADMIN_CRYPTED_PASSWORD
```  
> **Important: ** These three variables are interconnected and should change simultaneously.

** How to replace:**
1. Launch the application with current settings.
2. In an administrative interface, create a new user (with the necessary rights).
3. Copy the received passwords received.
4. Stop the application, clean the folder `crg` and turn it over again, replacing the old values with new hashs.

---

### 2. Mail settings
```
SPRING_MAIL_USERNAME
SPRING_MAIL_PASSWORD
```  
> For full work (including for passing healthcheck `auth-service`) Indicate the real accounting data of the mail account.  
> Without them, the mail service will not pass the check, although other applications will work in normal mode (except for password restoration).

---

### 3. Access to GeoServer
```
AUTH_REFRESH_USERNAME
AUTH_REFRESH_PASSWORD
```  
> Parameters for checking validity refresh_token.

>Additionally used as accounting data to enter into Web UI GeoServer.

**Two variables are interconnected and should change simultaneously **

To change the password from UI Geoserver You need to update the file:
```
assets/initialConfig/geoserver/security/usergroup/default/users.xml
```
— It sets the corresponding entries for GeoServer.

---
