import express from 'express';
import { getUserProfileCtrl, loginUserCrtl, registerUserCtrl, updateShippingAddressCtrl } from '../controllers/usersCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
const userRoutes = express.Router();

userRoutes.post('/register',registerUserCtrl);
userRoutes.post('/login',loginUserCrtl);
userRoutes.get('/profile',isLoggedIn,getUserProfileCtrl);
userRoutes.put('/update/shipping',isLoggedIn,updateShippingAddressCtrl);


export default userRoutes