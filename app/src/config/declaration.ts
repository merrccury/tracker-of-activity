export {}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            port: string;
            mongo: string;
            redis: string;
            mongoPort: string;
            redisPort: string;
        }
    }
    namespace Express{
        interface User{
            username: string;
            id: string;
        }
    }
}