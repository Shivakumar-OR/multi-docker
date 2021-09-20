const keys = require("./keys");
const redis= require("redis");

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: ()=>1000,
});

const substitute = redisClient.duplicate();

function Fibonacci(index){
    if(index<2) return 1;
    return Fibonacci(index-1) + Fibonacci(index-2);
}

//any time get new message, then call back function is going to get executed
substitute.on('message', (channel, message)=>{
    redisClient.hset('values', message, Fibonacci(parseInt(message)));
});

substitute.subscribe("insert"); //any one inserts new value to redis it will 
                                //listern to insert event and call "substitute.on" function
