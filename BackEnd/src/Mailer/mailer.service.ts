import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ifspbankplc@gmail.com',
        pass: 'kpto phvy genq fquz',
    },
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: 'ifspbankplc@gmail.com', 
      to,
      subject,
      text,
    };

    await this.transporter.sendMail(mailOptions);
  }
}