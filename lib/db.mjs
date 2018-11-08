import mysql from "promise-mysql";
import { loadSaltFromDb } from "./ids.mjs";

async function createConn() {
	if (!process.env.CHEVERETO_DB_URL && !process.env.CHEVERETO_DB_HOST) {
		throw new Error("CHEVERETO_DB_URL or CHEVERETO_DB_HOST has to be set");
	}

	let db = await mysql.createConnection(
		process.env.CHEVERETO_DB_URL || {
			host: process.env.CHEVERETO_DB_HOST,
			user: process.env.CHEVERETO_DB_USER || process.env.CHEVERETO_DB_USERNAME,
			password:
				process.env.CHEVERETO_DB_PASS || process.env.CHEVERETO_DB_PASSWORD,
			database:
				process.env.CHEVERETO_DB_NAME || process.env.CHEVERETO_DB_DATABASE
		}
	);

	return db;
}

let conn;
export async function getConn() {
	if (!conn) {
		conn = createConn();

		await loadSaltFromDb(conn);
	}

	return conn;
}