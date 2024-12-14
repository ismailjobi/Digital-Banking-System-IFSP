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
        pass: '',
    },
    });
  }
  //, html: string
  async sendMail(to: string, subject: string, text: string): Promise<void> {
    const mailOptions = {
      from: 'ifspbankplc@gmail.com',
      to,
      subject,
      text, // Pass raw HTML content here
    };

    await this.transporter.sendMail(mailOptions);
  }
}
