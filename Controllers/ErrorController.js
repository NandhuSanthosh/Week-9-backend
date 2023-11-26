module.exports.handleError = (err, req, res, next) => {
    res.status(err.status).send({message: err.message})
}