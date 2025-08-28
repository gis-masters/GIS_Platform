# GIS-Мастерская — открытая картографическая платформа
Платформа позволяет работать с картографическими материалами в браузере.

**Контакты:** [ссылка](https://gis-masters.ru/) <!-- замените на ваш URL -->

---

## Рекомендуемые системные требования
- ОС: Linux (рекомендуется Ubuntu 22.04 LTS или Ubuntu 24 с ядром не новее чем 6.8.x)
- ОЗУ: от 32 ГБ
- Диск: от 50 ГБ свободного места
- Процессор: Intel Core i5-12400K или лучше

## Минимальные системные требования
- ОЗУ: 24 ГБ
- Диск: 40 ГБ свободного места
- Процессор: Intel Core i5-12400K

## Мастеру установки необходим оступ в интернет на ресурсы:
- github.com
- hub.docker.com

---

## Быстрый старт

```bash
# 1) Создайте папку для удобной установки программы
sudo mkdir -p /opt/crg/
sudo chown -R user:user /opt/crg/
sudo chmod -R 777 /opt/crg/
cd /opt/crg

# 2) Скачайте мастер установки (через GitHub raw)
wget 'https://github.com/gis-masters/GIS_Platform/blob/main/installGisMastersApp.sh?raw=1' \
     -O installGisMastersApp.sh

# 3) Выдайте скаченному скрипту права на запуск
chmod +x installGisMastersApp.sh

# 4) Запустите установку и следуйте инструкции
./installGisMastersApp.sh
```
