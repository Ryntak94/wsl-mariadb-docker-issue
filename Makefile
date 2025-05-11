restore_db:
	docker compose cp ./dump.sql mariadb:/tmp/
	docker compose exec -T mariadb mariadb --user root --max-allowed-packet=1G --quick -e "source /tmp/dump.sql"
	docker compose exec -T mariadb rm /tmp/dump.sql

