import dotenv from 'dotenv';
import fs from "fs";
import environments from "@config/environments.json";
import { resolveEnvConfigPath } from '@utils/path.utils';

export type Environment = keyof typeof environments;
export type EnvironmentConfig = typeof environments[Environment];

const getCurrentEnvironment = (): Environment => {
    const ENV = process.env.ENV || "dev";
    checkEnvIsValid(ENV);
    return ENV as Environment;
}

const checkEnvIsValid = (env: string): void => {
    if (!(env in environments)) {
        throw new Error(`Invalid environment: [${env}]. Valid environments are: [${Object.keys(environments).join(", ")}]`);
    }
}

const getDotEnvPath = (env: Environment): string => {
    const dotEnvPath = resolveEnvConfigPath(env)
    checkDotEnvFileExists(dotEnvPath);
    return dotEnvPath;
}

const checkDotEnvFileExists = (path: string): void => {
    if (!fs.existsSync(path)) {
        throw new Error(`.env file for specific environment was not found: [${path}]`);
    }
}

const currentEnvironment = getCurrentEnvironment();

export const envConfig: EnvironmentConfig = environments[currentEnvironment];

export const initDotEnv = (): void => {
    dotenv.config({ path: getDotEnvPath(currentEnvironment) });
}