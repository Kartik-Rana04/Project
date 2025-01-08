
import * as nodemailer from 'nodemailer'
import {config} from 'dotenv'
import { HttpStatus, Logger } from '@nestjs/common';
import { Messages } from '../utils/message';
import { HandleResponse } from './exception-filter/helperResponse';
import { EmailFormatType, ResponseData } from '../utils/enum';
const sender = 'Shivinfotech <dhyan.shivinfotech@gmail.com>';
import * as moment from 'moment'
import { EmailFormat } from 'src/model/emailFormat.model';
config()

const transporter : any = nodemailer.createTransport({
    service : 'Gmail',
    port : 25,
    secure : false,
    auth : {
        user : process.env.EMAIL,
        pass : process.env.EMAIL_PASS
    }
})

export const emailSend = async (obj: any) => {
    const { email, otp, expiration_time, fullName } = obj;
    let mailDetail : any;

    if(otp && expiration_time && email && fullName){
      const emailFormat = await EmailFormat.findOne({
        where: { type: EmailFormatType.OTP_VERIFY },
      });
  
      if (!emailFormat) {
        Logger.error(Messages.EMAIL_FORMAT_NOT);
        return HandleResponse(
          HttpStatus.NOT_FOUND,
          ResponseData.ERROR,
          Messages.EMAIL_FORMAT_NOT,
        );
      }
  
      const currentTime = moment();
      const differenceInMinutes = expiration_time.diff(currentTime, 'minutes');
      mailDetail = {
        to: email,
        subject: 'OTP Verification',
        from: sender,
        html: emailFormat.body
          .replace('{{fullName}}', fullName)
          .replace('{{otp}}', otp)
          .replace('{{expiration_time}}', differenceInMinutes),
      };    
    }
    const mailSending: any = transporter.sendMail(
      mailDetail,
      function (error: any, info: any) {
        if (error) {
          Logger.error('error', error);
        } else {
          Logger.log(' Email sent: ' + info.response);
        }
      },
    );
    return mailSending;
  };