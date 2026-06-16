import path from "path";

export function resolveEnvConfigPath(envName: string): string {
    return resolvePath(`./config/.env.${envName}`);
}

export function resolveStorageStatePath(email: string): string {
    return resolvePath(`./.auth/${email}_storage_state.json`);
}

function resolvePath(pathToFile: string): string {
    return path.resolve(process.cwd(), pathToFile);
}