import redis, {RedisClient} from 'redis'

class RedisCR {

    private readonly client: RedisClient;

    public constructor() {
        this.client = redis.createClient({
            port: parseInt(process.env.redisPort),
            host: process.env.redis });
        this.client.on("ready", () => console.log("ready"));
        this.client.on("error", (err) => console.log(err));
        this.client.on("end", () => console.log("end"));
    }


    create(key: string, value: string): Promise<"OK"> {
        return new Promise<"OK">((resolve, reject) => {
            this.client.set(key, value, (error, status) => {
                if (error)
                    return reject(error);
                resolve(status);
            })
        })
    }

    read(key: string): Promise<string | null> {
        return new Promise<string | null>((resolve, reject) => {
            this.client.get(key, (error, value) => {
                if (error)
                    return reject(error);
                resolve(value);
            });
        });
    }
}

export default RedisCR;
