import { Context, Schema } from 'koishi';
export declare const name = "chatsun";
export interface Config {
    character: string;
    presets: string;
    llmurl: string;
    llmkey: string;
    llmmoduleName: string;
    llmplatform: 'openai' | 'anthropic' | 'google' | 'custom';
    temperature: number;
    embenable: boolean;
    emburl: string;
    embkey: string;
    embmoduleName: string;
    embplatform: 'openai' | 'custom';
    batchSize: number;
    selectSize: number;
}
export declare const Config: Schema<Config>;
export declare function apply(ctx: Context, config: Config): Promise<void>;
