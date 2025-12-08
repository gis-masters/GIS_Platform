## 🛠 Быстрый старт
```bash
  wget -qO installGisMastersApp.sh https://raw.githubusercontent.com/gis-masters/GIS_Platform_installer/main/installGisMastersApp.sh && chmod +x installGisMastersApp.sh && script -c "./installGisMastersApp.sh" installGisMastersAppLog.txt
```

## 🛠 Системные требования
<details open>
<summary><strong>Рекомендованные</strong></summary>

- **ОС**: Linux Ubuntu/Debian 24
- **Процессор**: Intel Core i7-13700K
- **Оперативная память: 64 GB
- **SSD NVMe**: 1 TB
</details>

<details>
<summary><strong>Минимальные</strong></summary>

- **ОС**: Linux Ubuntu/Debian 20
- **Процессор**: Intel Core i5-12400F
- **Оперативная память: 32 GB
- **Место на диске**: 20 GB (без учёта веса ОС, docker, файлов пользователей)

</details>

# Памятка по файлу `.env.example`

В этом документе описаны все переменные окружения, необходимые для корректной работы приложения. Не добавляйте и не удаляйте переменные без явной необходимости — следуйте инструкциям ниже.

---

## 📋 Структура переменных

### 1. Административные пароли  
```
SYSTEM_ADMIN_PASSWORD
SPRING_FLYWAY_PLACEHOLDERS_ADMIN_PASSWORD
CRG_OPTIONS_SYSTEM_ADMIN_CRYPTED_PASSWORD
```  
> **Важно:** эти три переменные связаны между собой и должны меняться одновременно.  

**Как заменить:**  
1. Запустите приложение с текущими настройками.  
2. В административном интерфейсе создайте нового пользователя (с нужными правами).  
3. Скопируйте полученные хэши паролей.  
4. Остановите приложение, очистите папку `crg` и разверните его заново, заменив старые значения на новые хэши.

---

### 2. Настройки почты  
```
SPRING_MAIL_USERNAME
SPRING_MAIL_PASSWORD
```  
> Для полноценной работы (в том числе для прохождения healthcheck `auth-service`) укажите реальные учётные данные почтового аккаунта.  
> Без них сервис почты не пройдет проверку, хотя другие функции приложения будут работать в штатном режиме (кроме восстановления пароля).

---

### 3. Доступ к GeoServer  
```
GEOSERVER_UI_LOGIN
SECURITY_JWT_CLIENT_ID
SECURITY_JWT_CLIENT_SECRET
GEOSERVER_UI_CRYPTED_PASSWORD
```  

**Переменные связаны между собой и должны меняться одновременно**

---