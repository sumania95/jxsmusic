import { createTRPCRouter, publicProcedure } from "../trpc";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { Resend } from 'resend';
import { env } from "@/env";

export const forgotPasswordRouter = createTRPCRouter({
    sendv2: publicProcedure
    .input(z.object({ 
      email: z.string(),
    }))
    .mutation(async({input,ctx}) =>{
      const {email} = input;
      const user = await ctx.db.user.findFirst({
        where: {email}
      })
      if (!user) {
        // fake delay to match real response time
        await new Promise((r) => setTimeout(r, 500))

        return {
          status: 201,
          message: "Please check your email",
        }
      }
      const resend = new Resend(env.NEXT_RESEND_API);
      const token = jwt.sign({ email: email }, String(env.AUTH_SECRET),{expiresIn: 60 * 60});
      const website = env.NEXT_PUBLIC_APP_URL
      console.log(`http://localhost:3000/auth/forgot-password/${token}`)
      await resend.emails.send({
        from: 'JEFF92 & AYAN SUMANIA <no-reply@jeff92ayansumania.com>',
        to: user.email!,
        subject: 'Reset Password',
        html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset=utf-8>
            <meta http-equiv=x-ua-compatible content="ie=edge">
            <title>RESET PASSWORD</title>
            <meta name=viewport content="width=device-width,initial-scale=1">
            <style>@media screen{@font-face{font-family:'Source Sans Pro';font-style:normal;font-weight:400;src:local('Source Sans Pro Regular'),local('SourceSansPro-Regular'),url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff')}@font-face{font-family:'Source Sans Pro';font-style:normal;font-weight:700;src:local('Source Sans Pro Bold'),local('SourceSansPro-Bold'),url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff')}}a,body,table,td{-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}table,td{mso-table-rspace:0pt;mso-table-lspace:0pt}img{-ms-interpolation-mode:bicubic}a[x-apple-data-detectors]{font-family:inherit!important;font-size:inherit!important;font-weight:inherit!important;line-height:inherit!important;color:inherit!important;text-decoration:none!important}div[style*="margin: 16px 0;"]{margin:0!important}body{width:100%!important;height:100%!important;padding:0!important;margin:0!important}table{border-collapse:collapse!important}a{color:#1a82e2}img{height:auto;line-height:100%;text-decoration:none;border:0;outline:0}</style>
        </head>
        <body style="background-color:#e9ecef; height: auto;width=600px;">
            <div style="padding-left: 20px;padding-bottom: 20px;">
                <div style="display:flex; justify-items: center; align-items: center; width=600px; ">
                    <h3 style="font-size: 20px;">Hi ${String(user.name)}.</h3>
                </div>
                <div style="display:flex; justify-items: center; align-items: center; width=600px; ">
                    <p style="font-size: 15px;">We received a request to reset your password. Click the button below to create a new password for your account.</p>
                </div>
                <div style="display:flex; justify-items: center; align-items: center; width=600px; ">
                    <p style="font-size: 15px;">If you did not forget your password, you can ignore this email.</p>
                </div>
                <div style="width: 100%; padding-top:20px;">
                    <a href="${website}/auth/forgot-password/${token}" target="_blank" style="width:auto; padding: 12px; font-size:30px; background-color: rgb(61, 56, 56); color: white; outline-style: none; border: 0;">RESET PASSWORD</a>
                </div>
            </div>
        </body>
        </html>`
      });
      return {
        status: 201,
        message: "Please check your email",
      };
    })
})