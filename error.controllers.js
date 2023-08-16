const handle400s = (err, request, response, next) => {
  if(err.code === "22P02") {
    response.status(400).send({msg: 'Bad Request'})
  }else if(err.status === 404){
    response.status(404).send({msg: 'Not Found'})
  }else{
    next(err)
  }
};

const handleCustomErrors = (err, request, response, next) => {
  if (err.msg && err.status) {
    response.status(err.status).send({ msg: err.msg });
  } else{
    next(err)
  }
};


module.exports = {handle400s, handleCustomErrors };

