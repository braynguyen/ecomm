// not found

const notFound = (req, res, next) => {
    const error = new Error(`Not found: ${req.originalURL}`);
    res.status(404);
    next(error);
};

// Error Handler

const errorHandler = (err, req, res, next) => {
    // 200 is okay so we set to 500 which is internal server error
    const statusCode = res.statusCode == 200 ? 500 : res.statusCode;
    req.status = statusCode;
    res.json({
        message: err?.message,
        stack: err.stack,
    });
}


module.exports = { errorHandler, notFound };