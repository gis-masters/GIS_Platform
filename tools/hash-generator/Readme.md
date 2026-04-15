# Hash Generator

Чтобы собрать приложение и Docker-образ, выполните:

```bash
./build-script.sh
```

Чтобы получить хэши, выполните команду и передайте свой пароль:

```bash
docker run --rm gismaster/gis-platform-ph "mypassword"
```

На выходе будут две строки:

```text
$2a$10$...
digest1:...
```
