const http = require('http');
const dotenv = require('dotenv');
// const mongoose = require('mongoose');

const app = require('./app');

// const { loadPlanetsData } = require('./models/planets.model');
const { loadSpaceXLaunches } = require('./models/launches.model');
const { mongoConnect } = require('./services/mongo');
dotenv.config({ path: './config.env' });

const PORT = process.env.PORT || 8001;
const server = http.createServer(app);

async function startServer() {
	try {
		await mongoConnect();
		await loadSpaceXLaunches();
		// await loadPlanetsData();
	} catch (err) {
		// debug undefined error
		console.log('Server launch error', err);
	}
	server.listen(PORT, () =>
		console.log(`Listening on http://localhost:${PORT}..`)
	);
}

startServer();
