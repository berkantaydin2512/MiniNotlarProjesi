const logger = (req, res, next) => {
    const method = req.method;
    const url = req.url;
    const ip   = req.ip || req.connection.remoteAddress;
    const tarih = new Date().toISOString(); 

    console.log(`[${tarih}] ${method} ${url} - (${ip})`);
    
    next();
};

module.exports = logger;