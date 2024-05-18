import {
  createUser,
  updateUser,
  verifyUser,
  logIn,
} from "../services/auth.service.js";

export const createUserHandler = async (req, res, next) => {
  try {
    const newUser = await createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export const verifyUserHandler = async (req, res, next) => {
  try {
    const user = await verifyUser(req.phoneNumber, req.code);
    res.status(200).json("user verified");
  } catch (error) {
    next(error);
  }
};

export const updateUserHandler = async (req, res, next) => {
  try {
    const updatedUser = await updateUser(req.body);
    res.status(200).json("User Updated");
  } catch (error) {
    next(error);
  }
};

 export async function logInHandler (req,res){
  try{
      const {email,password} = req.body
      const token = await logIn(email,password);
  
      res.cookie(token,token,{
          httpOnly : true
      }).json({token:token})
  }catch(error){
      throw error
  }
}
