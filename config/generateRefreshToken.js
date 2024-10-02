import jwt from 'jsonwebtoken';

const GenerateRefreshToken = (id)=>{
    return jwt.sign({id},process.env.MY_TOKEN_STRING,{expiresIn:"3d"});
}

export default GenerateRefreshToken;