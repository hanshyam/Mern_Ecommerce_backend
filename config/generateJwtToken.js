import jwt from 'jsonwebtoken';

const GenerateJwtToken = (user) => {
    return jwt.sign(
        {
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
            },
        },
        process.env.MY_TOKEN_STRING,
        { expiresIn: "1d" }
    );
};



export default GenerateJwtToken;