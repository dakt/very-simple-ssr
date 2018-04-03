export default (req, res, next) => {
    console.log(new Date().getTime(), req.method, req.path);
    next();
}