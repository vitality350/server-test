global.__basedir = __dirname;
const port = 4000;
const express = require("express");
const app = express();
const Joi = require('joi');

const data = [];
const incorrectTries = []

const schema = Joi.object().keys({
  email: Joi.string().email({ minDomainAtoms: 2}),
  phone: Joi.string().regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/),
  message: Joi.string().min(1).required()
}).xor('phone','email');

app.use('/', (req,res,next) => {
  console.log('Request accepted', new Date());
  next();
});

app.post("/", (req,res) => {
  const temp = Joi.validate(req.query, schema);
  temp['value'].date = new Date();
  if (temp['error']){ 
    incorrectTries.push(temp);
    res.status(400).send(temp);
  } else {
    data.push(temp['value']);
    res.status(201).send(temp['value']);
  }
});

app.get("/",(req,res)=>{
  res.status(200).send({
    accepted: data,
    notAccepted: incorrectTries
  });
})

app.listen(port, () => {
  console.log(`Run on ${port}`);
});

//ADDED	

