export type Payload = {
    userId: string;
} | null;
export declare function generateToken(userId: string): Promise<string>;
export declare function verifyToken(token: string): Promise<Payload>;
