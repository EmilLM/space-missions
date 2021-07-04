const parse = require('csv-parse');
const fs = require('fs');
const path = require('path');

const planets = require('./planets.mongo');

const isHabitable = (planet) => {
	return (
		planet['koi_disposition'] === 'CONFIRMED' &&
		planet['koi_insol'] > 0.36 &&
		planet['koi_insol'] < 1.11 &&
		planet['koi_prad'] < 1.6
	);
};
function loadPlanetsData() {
	return new Promise((reject, resolve) => {
		fs.createReadStream(
			path.join(__dirname, '..', '..', 'data', 'kepler_data.csv')
		)
			.pipe(
				parse({
					comment: '#',
					columns: true,
				})
			)
			.on('data', async (data) => {
				if (isHabitable(data)) {
					savePlanet(data);
				}
			})
			.on('error', (err) => {
				console.log(err);
				reject(err);
			})
			.on('end', async () => {
				const planetsFound = (await getAllPlanets()).length;
				console.log(`${planetsFound} planets found!`);

				resolve();
			});
	});
}
async function getAllPlanets() {
	return await planets.find({}, {'_id':0, '__v':0});
}
// upsert op to avoid adding planet doc on every server start
async function savePlanet(planet) {
	try {
		await planets.updateOne(
			{
				keplerName: planet.kepler_name,
			},
			{
				keplerName: planet.kepler_name,
			},
			{
				upsert: true,
			}
		);
	} catch (err) {
		console.log('Could not save planet', err);
	}
}

module.exports = {
	loadPlanetsData,
	getAllPlanets,
};
