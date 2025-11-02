import jwt from 'jsonwebtoken'

interface JwtPayload {
    userId: string;
}

//function to generate the token 
export const generateToken = (userId: string) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET as string);
    return token;
}

//funciton to verify the token
export const verifyToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
}