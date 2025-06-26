--Перезапишет колонку "Путь к файлу" чтобы его можно было успешно скачать
UPDATE data.files
SET path = '/opt/crg/' || substr(path, length('/opt/') + 1) --перепишем только первое вхождение
WHERE path LIKE '/opt/%'
  AND path NOT LIKE '/opt/crg/%';
--из-за второго условия файлы которые уже /opt/crg НЕ станут /opt/crg/crg