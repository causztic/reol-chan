const { youtube_id, youtube, getVideoPromise } = require('../../youtube_info.js');
const commando = require('discord.js-commando');
const constants = require('../../constants.js');

const YoutubeDL = require('youtube-dl');
const Request = require('request');

const MAX_QUEUE_SIZE = 20

module.exports = class RandomYoutubeCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'youtube',
			aliases: ['yt'],
			group: 'youtube',
			memberName: 'youtube',
			description: 'Get videos from REOL\'s youtube channel.',
			details: 'action can be [latest] or [random]. Defaults to latest video.',
			args: [
				{
					key: 'action',
					prompt: 'Get a video!',
					type: 'string',
					default: 'latest',
					infinite: false,
					wait: 1
				}
			]
		});
	};

	async run(msg, args) {
		if (args.action === "random") {
			console.log("Getting random video..");
			getVideoPromise("random").then((result) => {
				return msg.reply(result)
			}, (err) => {
				return msg.reply(constants.ERROR_MESSAGE)
			})
		} else if (args.action === "latest" || args.action === "") {
			getVideoPromise().then((result) => {
				return msg.reply(result)
			}, (err) => {
				return msg.reply(constants.ERROR_MESSAGE)
			})
		} else {
			s = args.split(" ")
			if (s.length() == 1){
				s << ""
			}
			switch (s[0]) {
				case 'play': return play(msg, s[1]);
				case 'skip': return skip(msg, s[1]);
				case 'queue': return queue(msg, s[1]);
				case 'pause': return pause(msg, s[1]);
				case 'resume': return resume(msg, s[1]);
			}
		}
	};

	// 
	// PARTIAL CODE FROM https://www.npmjs.com/package/discord.js-music
	// Taken out to fit with commando
	//

	/*
	 * Gets a queue.
	 *
	 * @param server The server id.
	 */
	getQueue() {
		// Check if global queues are enabled.
		server = '_'; // Change to global queue.
		// Return the queue.
		if (!queues[server]) queues[server] = [];
		return queues[server];
	}

	/*
	 * Play command.
	 *
	 * @param msg Original message.
	 * @param suffix Command suffix.
	 */
	play(msg, suffix) {
		// Make sure the user is in a voice channel.
		if (msg.author.voiceChannel === null) return msg.reply('You\'re not in a voice channel.');

		// Make sure the suffix exists.
		if (!suffix) return msg.reply('No video specified!');

		// Get the queue.
		const queue = getQueue();

		// Check if the queue has reached its maximum size.
		if (queue.length >= MAX_QUEUE_SIZE) {
			return msg.reply('Maximum queue size reached!');
		}

		// Get the video information.
		msg.reply('Searching...').then(response => {
			// If the suffix doesn't start with 'http', assume it's a search.
			if (!suffix.toLowerCase().startsWith('http')) {
				suffix = 'gvsearch1:' + suffix;
			}

			// Get the video info from youtube-dl.
			YoutubeDL.getInfo(suffix, ['-q', '--no-warnings', '--force-ipv4'], (err, info) => {
				// Verify the info.
				if (err || info.format_id === undefined || info.format_id.startsWith('0')) {
					return msg.update(response, 'Invalid video!');
				}

				// Queue the video.
				msg.update(response, 'Queued: ' + info.title).then(() => {
					queue.push(info);

					// Play if only one element in the queue.
					if (queue.length === 1) executeQueue(msg, queue);
				}).catch(() => { });
			});
		}).catch(() => { });
	}

	/*
	 * Skip command.
	 *
	 * @param msg Original message.
	 * @param suffix Command suffix.
	 */
	skip(msg, suffix) {
		// Get the voice connection.
		const voiceConnection = client.voiceConnections.get('server', msg.server);
		if (voiceConnection === null) return msg.reply('No music being played.');

		// Get the queue.
		const queue = getQueue();

		// Get the number to skip.
		let toSkip = 1; // Default 1.
		if (!isNaN(suffix) && parseInt(suffix) > 0) {
			toSkip = parseInt(suffix);
		}
		toSkip = Math.min(toSkip, queue.length);

		// Skip.
		queue.splice(0, toSkip - 1);

		// Resume and stop playing.
		if (voiceConnection.playingIntent) voiceConnection.resume();
		voiceConnection.stopPlaying();

		return msg.reply('Skipped ' + toSkip + '!');
	}

	/*
	 * Queue command.
	 *
	 * @param msg Original message.
	 * @param suffix Command suffix.
	 */
	queue(msg, suffix) {
		// Get the queue.
		const queue = getQueue();

		// Get the queue text.
		const text = queue.map((video, index) => (
			(index + 1) + ': ' + video.title
		)).join('\n');

		// Get the status of the queue.
		let queueStatus = 'Stopped';
		const voiceConnection = client.voiceConnections.get('server', msg.server);
		if (voiceConnection !== null) {
			queueStatus = voiceConnection.paused ? 'Paused' : 'Playing';
		}

		// Send the queue and status.
		return msg.reply('Queue (' + queueStatus + '):\n' + text);
	}

	/*
	 * Pause command.
	 *
	 * @param msg Original message.
	 * @param suffix Command suffix.
	 */
	pause(msg, suffix) {
		// Get the voice connection.
		const voiceConnection = client.voiceConnections.get('server', msg.server);
		if (voiceConnection === null) return msg.reply('No music being played.');
		if (voiceConnection.playingIntent) voiceConnection.pause();
		// Pause.
		return msg.reply('Playback paused.');
	}

	/*
	 * Resume command.
	 *
	 * @param msg Original message.
	 * @param suffix Command suffix.
	 */
	resume(msg, suffix) {
		// Get the voice connection.
		const voiceConnection = client.voiceConnections.get('server', msg.server);
		if (voiceConnection === null) return msg.reply('No music being played.');

		// Resume.
		if (voiceConnection.playingIntent) voiceConnection.resume();
		return msg.reply('Playback resumed.');
	}

	/*
	 * Execute the queue.
	 *
	 * @param msg Original message.
	 * @param queue The queue.
	 */
	executeQueue(msg, queue) {
		// If the queue is empty, finish.
		if (queue.length === 0) {
			msg.reply('Playback finished.');

			// Leave the voice channel.
			const voiceConnection = client.voiceConnections.get('server', msg.server);
			if (voiceConnection !== null) client.leaveVoiceChannel(voiceConnection.voiceChannel);
		}

		new Promise((resolve, reject) => {
			// Join the voice channel if not already in one.
			const voiceConnection = client.voiceConnections.get('server', msg.server);
			if (voiceConnection === null) {
				// Check if the user is in a voice channel.
				if (msg.author.voiceChannel) {
					client.joinVoiceChannel(msg.author.voiceChannel).then(connection => {
						resolve(connection);
					}).catch(() => { });
				} else {
					// Otherwise, clear the queue and do nothing.
					queue.splice(0, queue.length);
					reject();
				}
			} else {
				resolve(voiceConnection);
			}
		}).then(connection => {
			// Get the first item in the queue.
			const video = queue[0];

			// Play the video.
			msg.reply('Now Playing: ' + video.title).then(() => {
				connection.playRawStream(Request(video.url)).then(intent => {
					// Catch errors in the connection.
					connection.streamProc.stdin.on('error', () => {
						// Skip to the next song.
						queue.shift();
						executeQueue(msg, queue);
					});
					connection.streamProc.stdout.on('error', () => {
						// Skip to the next song.
						queue.shift();
						executeQueue(msg, queue);
					});

					// Catch all errors.
					intent.on('error', () => {
						// Skip to the next song.
						queue.shift();
						executeQueue(msg, queue);
					});

					// Catch the end event.
					intent.on('end', () => {
						// Wait a second.
						setTimeout(() => {
							// Remove the song from the queue.
							queue.shift();

							// Play the next song in the queue.
							executeQueue(msg, queue);
						}, 1000);
					});
				}).catch(() => { });
			}).catch(() => { });
		}).catch(() => { });
	}
}
