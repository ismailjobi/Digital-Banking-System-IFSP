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
        pass: 'rubp ylor rqgk qchu', // Replace with an environment variable for security
      },
    });
  }

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    const mailOptions = {
      from: 'ifspbankplc@gmail.com',
      to,
      subject,
      html, // Pass raw HTML content here
    };

    await this.transporter.sendMail(mailOptions);
  }
}