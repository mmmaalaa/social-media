export const signUp = (username, activationLink) => `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Activate Your Account</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
            color: #333333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .header {
            background-color: #0066cc;
            padding: 20px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 30px;
        }
        .button {
            display: inline-block;
            background-color: #0066cc;
            color: #ffffff !important;
            text-decoration: none;
            font-weight: bold;
            padding: 12px 30px;
            border-radius: 4px;
            margin: 20px 0;
        }
        .button:hover {
            background-color: #0055aa;
        }
        .link {
            word-break: break-all;
            color: #0066cc;
        }
        .footer {
            background-color: #f5f5f5;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666666;
        }
        @media only screen and (max-width: 600px) {
            .container {
                width: 100%;
            }
            .content {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Saraha Account Activation</h1>
        </div>
        <div class="content">
            <p>Hello ${username},</p>
            <p>Thank you for registering with Saraha. We're excited to have you on board!</p>
            <p>To activate your account and get started, please click the button below:</p>
            <div style="text-align: center;">
                <a href="${activationLink}" class="button">Activate Account</a>
            </div>
            <p>If the button above doesn't work, please copy and paste the following link into your browser:</p>
            <p><a href="${activationLink}" class="link">${activationLink}</a></p>
            <p>This link will expire in 24 hours for security reasons.</p>
            <p>If you did not create an account with us, please disregard this email.</p>
            <p>Best regards,<br>The Saraha Team</p>
        </div>
        <div class="footer">
            <p>&copy; 2025 Saraha. All rights reserved.</p>
            <p>123 Main Street, City, Country</p>
        </div>
    </div>
</body>
</html>`;