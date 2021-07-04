const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

mongoose.connection.once('open', () => console.log('DB ready!'));
mongoose.connection.on('error', (err) => console.error(err));

const DB = process.env.MONGO_URL;

async function mongoConnect() {
	await mongoose.connect(DB, {
		useNewUrlParser: true,
		useFindAndModify: false,
		useCreateIndex: true,
		useUnifiedTopology: true,
	});
}

async function mongoDisconnect() {
	await mongoose.disconnect();
}

module.exports = { mongoConnect, mongoDisconnect };
