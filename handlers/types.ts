import { CommandInteraction } from "discord.js";

export declare type CommandInteractionConsumer = (interaction: CommandInteraction) => Promise<void>;