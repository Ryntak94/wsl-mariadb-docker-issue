const fs = require('fs');
const { faker } = require('@faker-js/faker');

const outputFile = 'dump.sql';
const targetSize = 2 * 1024 * 1024 * 1024 ; // 2GB in bytes

const f = fs.openSync(outputFile, 'w');
fs.closeSync(f);
const stream = fs.createWriteStream(outputFile, { flags: 'w'});

// Write CREATE TABLE statement
stream.write(`CREATE DATABASE test;\n`)
stream.write(`USE test;\n`)
stream.write(`CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	name VARCHAR(100),
	email VARCHAR(100)
);\n`);

let bytesWritten = fs.statSync(outputFile).size;

function escapeStr(str) {
	return str.replace(/'/g, "''");
}

// Keep writing inserts until the file hits the target size
function writeInserts() {
	let ok = true;

	while (bytesWritten < targetSize && ok) {
		const name = escapeStr(faker.person.fullName());
		const email = escapeStr(faker.internet.email());
		const sql = `INSERT INTO users (name, email) VALUES ('${name}', '${email}');\n`

		bytesWritten += Buffer.byteLength(sql)
		ok = stream.write(sql)
	}

	if (bytesWritten < targetSize) {
		stream.once('drain', writeInserts);
	}	else	{
		console.log('Finished writing ~2GB SQL file.');
		stream.end();
	}
}

writeInserts();

