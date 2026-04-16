import { ChatInputCommandInteraction } from 'discord.js';

export declare type CommandInteractionConsumer = (interaction: ChatInputCommandInteraction) => Promise<void>;
