const { youtube_id, youtube, getVideoPromise } = require('../modules/youtube.js');
const commando = require('discord.js-commando');
const constants = require('../constants.js');
const ytdl = require('ytdl-core');
const Request = require('request');
const util = require("../util.js");

const MAX_QUEUE_SIZE = 20
const streamOptions = { seek: 0, volume: 1 };

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
		this.queues = {};
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

		var server = '_'; // Change to global queue.
		// Return the queue.
		if (!this.queues[server]) this.queues[server] = [];
		return this.queues[server];
	}

	/*
	 * Play command.
	 *
	 * @param msg Original message.
	 * @param suffix Command suffix.
	 */
	play(msg, suffix) {
		// Make sure the user is in a voice channel.
		console.log(msg.author);
		if (msg.author.voiceChannel === null) return msg.reply('You\'re not in a voice channel.');

		// Make sure the suffix exists.
		if (!suffix) return msg.reply('No video specified!');

		// Get the queue.
		const queue = this.getQueue();

		// Check if the queue has reached its maximum size.
		if (queue.length >= MAX_QUEUE_SIZE) {
			return msg.reply('Maximum queue size reached!');
		}

		// Get the video info from youtube-dl.
		ytdl.getInfo(suffix).then(info => {
			// Queue the video.
			msg.reply('Queued: ' + info.title).then(() => {
				queue.push(info);

				// Play if only one element in the queue.
				if (queue.length === 1) this.executeQueue(msg, queue);
			}).catch(() => { });
		});
	}

	/*
	 * Skip command.
	 *
	 * @param msg Original message.
	 * @param suffix Command suffix.
	 */
	skip(msg, suffix) {
		// Get the voice connection.
		const voiceConnection = this.client.channels.get(constants.MUSIC_VOICE_ID);
		if (voiceConnection === null) return msg.reply('No music being played.');

		// Get the queue.
		const queue = this.getQueue();

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
		const queue = this.getQueue();

		// Get the queue text.
		const text = queue.map((video, index) => (
			(index + 1) + ': ' + video.title
		)).join('\n');

		// Get the status of the queue.
		let queueStatus = 'Stopped';
		const voiceConnection = this.client.channels.get(constants.MUSIC_VOICE_ID);
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
		const voiceConnection = this.client.channels.get(constants.MUSIC_VOICE_ID);
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
		const voiceConnection = this.client.channels.get(constants.MUSIC_VOICE_ID);
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
		
		let music_chn = this.client.channels.get(constants.MUSIC_VOICE_ID);
		// If the queue is empty, finish.
		if (queue.length === 0) {
			util.setRandomNowPlaying(this.client);
			music_chn.join().then(connection => {
				connection.disconnect()
			})
		} else {
			music_chn.join().then(connection => {
				// Get the first item in the queue.
				const video = queue[0];
				// Play the video.
				msg.reply('Now Playing: ' + video.title).then(() => {
					this.client.user.setGame(video.title, video.video_url);
					const stream = ytdl(video.video_url, {filter : 'audioonly'});
					const dispatcher = connection.playStream(stream, streamOptions);

					dispatcher.on('error', () => {
						queue.shift();
						this.executeQueue(msg, queue);
					})
					
					dispatcher.on("end", () => {
						setTimeout(() => {
							queue.shift();
							this.executeQueue(msg, queue);
						}, 1000);
					})

				}).catch((e) => {   
					console.error(e)
					msg.reply(e) 
				});
			}).catch((e) => {   
				console.error(e) 
				msg.reply(e) 
			});
		}
	}

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
			var s = args.action.split(" ")
			if (s.length == 1){
				s << ""
			}
			switch (s[0]) {
				case 'play': return this.play(msg, s[1]);
				case 'skip': return this.skip(msg, s[1]);
				case 'queue': return this.queue(msg, s[1]);
				case 'pause': return this.pause(msg, s[1]);
				case 'resume': return this.resume(msg, s[1]);
			}
		}
	};
}
