module.exports = theFunc =>(req,res,next)=>{
    // Promise.resolve(theFunc(req,res,next)).catch(next);
    Promise.resolve(theFunc(req, res, next))
    .catch(err => {
        console.log('An error occurred:', err);
        next(err);
    });
}