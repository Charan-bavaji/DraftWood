module.exports = (funct) => (req, res, next) => {

    Promise.resolve(funct(req, res, next)).catch(next);
}