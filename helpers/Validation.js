const validator = require('validator')
const validateUser = (req)=>{
const {firstName,lastName,emailId,password} = req.body
if(!firstName||!lastName){
    throw new Error('invalid namessss')
}
else if(firstName.length<4||firstName>50){
    throw new Error('emaill id is not valid ......')
}
else if(!validator.isStrongPassword(password)){
    throw new Error('please enter a strong password....')
}
}
module.exports = {validateUser}