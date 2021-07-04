const {
	getAllLaunches,
	addNewLaunch,
	existsLaunchWithId,
	abortLaunchbyId,
} = require('../../models/launches.model');
const { getPagination } = require('../../services/query');

async function httpGetAllLaunches(req, res) {
	const { skip, limit } = getPagination(req.query);
	const launches = await getAllLaunches(skip, limit);
	return res.status(200).json(launches);
}

async function httpAddNewLaunch(req, res) {
	const launch = req.body;

	if (
		!launch.mission ||
		!launch.rocket ||
		!launch.launchDate ||
		!launch.target
	) {
		return res.status(400).json({
			error: 'Missing required data!',
		});
	}
	launch.launchDate = new Date(launch.launchDate);
	if (isNaN(launch.launchDate)) {
		return res.status(400).json({
			error: 'Invalid launch date',
		});
	}
	await addNewLaunch(launch);
	return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
	const launchId = Number(req.params.flightNumber);
	const launch = await existsLaunchWithId(launchId);
	if (!launch) {
		return res.status(404).json({
			error: 'Launch not found',
		});
	}
	const aborted = await abortLaunchbyId(launchId);
	if (!aborted) {
		res.status(400).json({ error: 'Could not find launch to abort!' });
	}
	return res.status(200).json(aborted);
}

module.exports = {
	httpGetAllLaunches,
	httpAddNewLaunch,
	httpAbortLaunch,
};
