echo "Удаляем директорию"
rm -rf rxjsconf || true

echo "Клонируем проект"
git clone https://github.com/learnrxjs/rxjsconf.git --depth 1 rxjsconf

echo "Копируем TSL сертификаты"
cp ./certi/custom.* ./rxjsconf/misc/ssl

echo "Переходим в директорию с проектом"
cd rxjsconf

echo "Останавливаем предыдущий контейнер"
docker kill rxjsconf

echo "Уничтожение контейнера"
docker rm rxjsconf --volumes

echo "Начинаем сборку"
docker build --tag rxjsconf .

echo "Запускаем контейнер"
docker run \
  --name rxjsconf \
  --env-file ./.env
  --publish 80:80 \
  --publish 443:443 \
  --detach rxjsconf
