restore_db:
	docker compose cp ./dump.sql mariadb:/tmp/
	docker compose exec -T mariadb mariadb --user root --max-allowed-packet=1G --quick -e "source /tmp/dump.sql"
	docker compose exec -T mariadb rm /tmp/dump.sql

dump.sql: 
	node index.js

mariadb:
	docker compose up -d

node_modules:
	npm install

start: node_modules mariadb dump.sql restore_db

stats:
	docker stats

exec_mariadb_server:
	docker exec -it mariadb mariadb -A

