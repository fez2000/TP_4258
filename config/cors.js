const whitelist = [
    'http://localhost',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://localhost:3000',
    'https://localhost:3001',
    'https://localhost',
    
];
exports.whitelist = whitelist;

exports.corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            return callback(new Error(`${origin} Not allowed by CORS`), false);
        }
    },
};
