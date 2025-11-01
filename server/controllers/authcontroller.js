import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import { text } from 'express';
import transport from '../config/nodemailer.js';


export const register = async(req, res)=>{
    const {name , email, password}= req.body;

    if(!name|| !email ||!password){
        return res.json({success:false , message:'Missing Details'})
    }

    try {
        const existingUser = await userModel.findOne({email})

        if(existingUser){
            return res.json({success:false , message:"User already exists"});
        }
       const hasedPassword = await bcrypt.hash(password, 10 );

       const user= new userModel({name, email, password:hasedPassword});
       await user.save();

       const token =jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn:'7d'});
       res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV==='production',
        sameSite: process.env.NODE_ENV==='production'? 'none':'strict',
        maxAge: 7*24*60*60*1000
       })
        
       return res.json({success:true});

    }catch(error){
        res.json({success:false , message:error.message})
    }
}

export const login = async (req, res)=>{
   const {email, password}= req.body;
   if(!email || !password){
    return res.json({success:false , message: `Email and Password is required`})
   }

   try{
const user = await userModel.findOne({email});

if(!user){
    return res.json({success:false, message:'Invalid email'})
}

const isMatch= await bcrypt.compare(password, user.password);

if(!isMatch){
    return res.json({success:false, message:`Invalid password`})
}

  const token =jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn:'7d'});
       res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV==='production',
        sameSite: process.env.NODE_ENV==='production'? 'none':'strict',
        maxAge: 7*24*60*60*1000
       });

       const mailOptions ={
        from:`"AuthSys" <${process.env.SENDER_EMAIL}>`,
        to:email,
        subject:`Servicio`,
        text:`Welcome to Servicio!!. Loggin Successfully with: ${email} in Servicio `
       }
       try {
  const info = await transport.sendMail(mailOptions);
  console.log("✅ Email sent successfully:", info);
} catch (mailError) {
  console.error("❌ Failed to send email:", mailError);
}
       return res.json({success:true});
   }catch(error){
return res.json({success:false , message:error.message});
   }
}

export const logout = async (req, res)=>{
    try{
  res.clearCookie('token', {
    httpOnly: true,
        secure: process.env.NODE_ENV==='production',
        sameSite: process.env.NODE_ENV==='production'? 'none':'strict'
  })

  return res.json({success:true , message:'Logged Out'})
    }catch (error){
        return res.json({success:false , message:error.message});
    }
}

export const sendVerifyOtp = async (req , res)=>{
   
    try {
   const userId = req.user.userId;
    const user = await userModel.findById(userId);

    if(user.isAccountVerified === true){
        return res.json({success:false, message:"Account already veridied"})
    }
    const otp = String(Math.floor(100000+Math.random()* 900000));
    user.verifyOtp=otp;
    user.verifyOtpExpireAt = (Date.now()+(24 *60 * 60 *1000));

    await user.save();

    const mailOptions={
        from:`"AuthSys" <${process.env.SENDER_EMAIL}>`,
        to:user.email,
        subject:`OTP!`,
        text:`Your Otp is for Servicio is ${otp}`
    }
    await transport.sendMail(mailOptions);
    res.json({success:true, message:'Verification OTP sent on Email'});
} catch (error) {
    res.json({success:false , message:error.message});
}
}

export const verifyEmail = async(req, res)=>{
     const { otp } = req.body;
  const userId = req.user.userId;
 if(!userId || !otp){
    return res.json({success:false , message:'Missing Details'});
 }

 try {
    const user = await userModel.findById(userId);
    if(!user){
        return res.json({success:false , message:'User not found!'});

    }
    if(user.verifyOtp==='' || user.verifyOtp!==otp){
       return res.json({success:false , message:'Invaild Otp'});
    }

    if(user.verifyOtpExpireAt < Date.now()){
        return res.json({success:false , message:'Otp expired'});
    }
    user.isAccountVerified=true;
    user.verifyOtp='';
    user.verifyOtpExpireAt=0;
    await user.save();
    return res.json({success:true, message:'Email verified successfully'});
    
 } catch (error) {
    return res.json({success:false, message:error.message});
 }
 }

 export const isAuthenticated= async(req , res)=>{
      try {
        return res.json({success:true});
      } catch (error) {
        res.json({success:false , message:error.message});
      }
 }

 export const sendResetOtp= async (req, res)=>{
   
    const {email}= req.body;
    if(!email){
        return res.json({success:false , message:"Email is required"})
    }

    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success:false, message:'User not found'});
        }


        const otp = String(Math.floor(100000+Math.random()* 900000));
    user.resetOtp=otp;
    user. resetOtpExpireAt = (Date.now()+(15 *60 *1000));

    await user.save();

    const mailOptions={
        from:`"AuthSys" <${process.env.SENDER_EMAIL}>`,
        to:user.email,
        subject:`Password Reset OTP!! `,
        text:`Your Otp is ${otp} `
    }
    await transport.sendMail(mailOptions);
    return res.json({success:true, message:`Password Reset Otp sent successfuly`});

    } catch (error) {
        return res.json({success:false , message:error.message});
    }
 }

 export const resetPassword = async(req, res)=>{
  
   const {email , otp, newPassword}= req.body;
   
   if(!email  || !otp || !newPassword){
    return res.json({success:false, message:'Email, OTP, and new password are required'});
   }

   try {
      const user = await userModel.findOne({email});

      if(!user){
        return res.json({success:false, message:"User not found"});
      }

      if(user.resetOtp==="" || user.resetOtp !==otp){
        return res.json({success:false, message:"Invalid OTP!" });
      }

      if(user.resetOtpExpireAt <Date.now()){
         return res.json({success:false, message:" OTP Expired!!" });
      }


      const hasedPassword = await bcrypt.hash(newPassword, 10);
      user.password=  hasedPassword;
      user.resetOtp="";
      user.resetOtpExpireAt =0;

      await user.save();
      
       const mailOptions={
        from:`"AuthSys" <${process.env.SENDER_EMAIL}>`,
        to:user.email,
        subject:`Password changed ` ,
        text:`Your Password is changed successfuly and your password is ${newPassword} `
    }
    await transport.sendMail(mailOptions);

      return res.json({success:true, message:"Password reset successfuly "})
   } catch (error) {
    return res.json({success:false , message:error.message});
   }
 } 