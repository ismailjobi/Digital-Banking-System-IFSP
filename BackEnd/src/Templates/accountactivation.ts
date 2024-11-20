import * as Handlebars from 'handlebars';

export function generateAccountActivation(name: string, accounts: Array<{ AccountNumber: string , AccountType: string, Balance: string }>): string {
  const htmlTemplate = `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
          body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333333;
              margin: 0;
              padding: 0;
          }
          .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #dddddd;
              border-radius: 10px;
              background-color: #f9f9f9;
          }
          .header {
              text-align: center;
              padding: 10px 0;
              border-bottom: 1px solid #dddddd;
          }
          .header h1 {
              color: #2c3e50;
          }
          .content {
              margin: 20px 0;
          }
          .table-container {
              margin-top: 20px;
          }
          table {
              width: 100%;
              border-collapse: collapse;
          }
          th, td {
              text-align: left;
              padding: 10px;
              border: 1px solid #dddddd;
          }
          th {
              background-color: #2c3e50;
              color: white;
          }
          .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 12px;
              color: #888888;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Account Activation Notice</h1>
          </div>
          <div class="content">
              <p>Dear {{Name}},</p>
              <p>We are delighted to inform you that your account with the following details has been successfully activated:</p>
          </div>
          <div class="table-container">
              <table>
                  <thead>
                      <tr>
                          <th>Account Number</th>
                          <th>Account Type</th>
                          <th>Balance</th>
                      </tr>
                  </thead>
                  <tbody>
                      {{#each Accounts}}
                      <tr>
                          <td>{{AccountNumber}}</td>
                          <td>{{AccountType}}</td>
                          <td>{{Balance}}</td>
                      </tr>
                      {{/each}}
                  </tbody>
              </table>
          </div>
          <div class="content">
              <p>If you have any questions or need further assistance, please feel free to contact our support team.</p>
              <p>Thank you for choosing IFSP Bank. We look forward to serving you.</p>
              <p>Regards,<br>IFSP Bank Support Team</p>
          </div>
          <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
          </div>
      </div>
  </body>
  </html>
  `;

  // Compile the template using Handlebars
  const template = Handlebars.compile(htmlTemplate);

  // Prepare data object
  const templateData = {
    Name: name,
    Accounts: accounts.map((account) => ({
      AccountNumber: account.AccountNumber,
      AccountType: account.AccountType,
      Balance: account.Balance
    }))
  };

  // Return the compiled HTML with dynamic data
  return template(templateData);
}
