export function generateRandomEmail(): string {
    return `test${Date.now()}@test.com`;
}

export function generateRandomEmailWithPrefix(prefix: string): string {
    return `${prefix}_${Date.now()}@test.com`;
}