import { getTableName, removePropertyPrefix } from "../utils/utils.mjs";

const REMOVE_FIELDS = [];
function createAlbumObject(albumData) {
	let album = removePropertyPrefix(albumData, "album_");

	for (let field in REMOVE_FIELDS) {
		delete album[field];
	}

	return album;
}

export default db => ({
	find(query = {}) {
		if (Object.keys(query).length) {
			let props = Object.keys(query)
				.map(key => `album_${key}=?`)
				.join(" AND ");

			return db
				.query(
					`SELECT * FROM ${getTableName("albums")} WHERE ${props}`,
					Object.values(query)
				)
				.then(albums => albums.map(createAlbumObject));
		}

		return db
			.query(`SELECT * FROM ${getTableName("albums")}`)
			.then(albums => albums.map(createAlbumObject));
	}
});
