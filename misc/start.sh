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

echo "Переменные окружения"
export $(grep -v '^#' ../.env | xargs -0)

echo "Начинаем сборку"
docker build --build-arg SUPABASE_URL --build-arg SUPABASE_KEY --tag rxjsconf .

echo "Запускаем контейнер"
docker run --name rxjsconf --publish 80:80 --publish 443:443 --detach rxjsconf
