import Discord from 'discord.js';

export class DiscordClient {
    private static _client : Discord.Client;
    private static _initialized : boolean;

    public static get instance() {
        if (!DiscordClient._initialized) {
            throw new Error("Client must be initialized to get instance");
        }

        return DiscordClient._client;
    }

    static async init(token: string) {
        if (DiscordClient._client) {
            throw new Error("Client already initialized");
        }

        const client = DiscordClient._client = new Discord.Client();

        await client.login(token);

        return new Promise((res,rej) => {
            client.once('ready', () => {
                DiscordClient._initialized = true;
                res(client);
            });
        });
    }
}