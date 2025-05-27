export const changeEmail = (MESSAGE, VERIFY_URL) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
      text-align: center;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #007bff;
      color: #ffffff;
      padding: 15px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      padding: 20px;
      font-size: 16px;
      line-height: 1.6;
      color: #333333;
    }
    .button {
      display: inline-block;
      background-color: #007bff;
      color: #ffffff;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 5px;
      font-size: 16px;
      margin: 20px 0;
    }
    .button:hover {
      background-color: #0056b3;
    }
    .footer {
      text-align: center;
      font-size: 14px;
      color: #777777;
      margin-top: 20px;
    }
    @media screen and (max-width: 600px) {
      .container {
        width: 100%;
        margin: 10px;
        padding: 10px;
      }
      .button {
        width: 100%;
        text-align: center;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Change Email Request</h2>
    </div>
    <div class="content">
      <p>${MESSAGE}</p>
      <p><a href="${VERIFY_URL}" class="button">Verify Email</a></p>
      <p><small>This link expires in 24 hours.</small></p>
    </div>
    <div class="footer">
      <p>© 2025 Your App. All Rights Reserved.</p>
    </div>
  </div>
</body>
</html>`;
