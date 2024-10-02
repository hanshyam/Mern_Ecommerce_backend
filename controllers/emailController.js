import asyncHandler from 'express-async-handler';
import nodemailer from 'nodemailer';

const sendEmail = asyncHandler( async (data,req,res)=>{
    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, 
        auth: {
           user: 'richmond.gerlach93@ethereal.email',
           pass: 'KfQPAHD99zC8xjN4wD'
        },
      });
    
      const info = await transporter.sendMail({
        from: '"hey 👻" <abc@gmail.com>', 
        to: data.to, 
        subject: data.subject, 
        text: data.text, 
        html: data.htm, 
      });

      console.log("Message sent: %s", info.messageId);

})

export default sendEmail;