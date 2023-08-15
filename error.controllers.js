const handleCustomErrors = (err, request, response, next) => {
  if (err.msg && err.status) {
    response.status(err.status).send({ msg: err.msg });
  } else{
    next(err)
  }
};


module.exports = {handleCustomErrors };
