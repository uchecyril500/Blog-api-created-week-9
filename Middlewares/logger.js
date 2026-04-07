
 //custom (error login function) middleware
const logRequest = (req, res, next) => {

    const timestamp = new Date().toISOString();
    console.log(`${timestamp} - ${req.method} ${req.url} from ${req.ip}`);
    next(); //Dont forget  
}

module.exports = logRequest;
