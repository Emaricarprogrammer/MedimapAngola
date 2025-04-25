import dotenv from 'dotenv';
dotenv.config();
function ResetPasswordTemplate(token: string): string {
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #444;
            margin: 0;
            padding: 0;
            background-color: #f5f7fa;
        }
        .email-container {
            max-width: 500px;
            margin: 20px auto;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        }
        .header {
            background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
            padding: 30px;
            text-align: center;
            color: white;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .content {
            padding: 30px;
            background: white;
        }
        .btn-primary {
            display: block;
            width: 80%;
            margin: 25px auto;
            padding: 14px;
            background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
            color: white !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            text-align: center;
            box-shadow: 0 4px 6px rgba(76, 175, 80, 0.2);
            transition: all 0.3s ease;
        }
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(76, 175, 80, 0.3);
        }
        .link-box {
            background: #f8f9fa;
            border-left: 4px solid #4CAF50;
            padding: 15px;
            margin: 20px 0;
            word-break: break-all;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            border-radius: 0 4px 4px 0;
        }
        .footer {
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #777;
            background: #f5f7fa;
            border-top: 1px solid #e1e5eb;
        }
        .highlight {
            font-weight: 600;
            color: #2E7D32;
        }
        .divider {
            height: 1px;
            background: linear-gradient(to right, transparent, #e1e5eb, transparent);
            margin: 25px 0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Redefinição de Senha</h1>
        </div>
        
        <div class="content">
            <p>Olá,</p>
            <p>Recebemos uma solicitação para redefinir a senha da sua conta MediMap Angola. Para continuar, clique no botão abaixo:</p>
            
            <a href="${process.env.RESET_URI}/reset_password?auth=${token}" class="btn-primary">
                Redefinir Senha
            </a>
            
            <div class="divider"></div>
            
            <p>Se o botão não funcionar, copie e cole este link no seu navegador:</p>
            <div class="link-box">
                ${process.env.RESET_URI}/reset_password?auth=${token}
            </div>
            
            <p>Este link expira em <span class="highlight">1 hora</span> por motivos de segurança.</p>
            
            <p><em>Não solicitou esta alteração? Ignore este e-mail ou entre em contato conosco se tiver dúvidas.</em></p>
        </div>
        
        <div class="footer">
            <p>Atenciosamente,<br>
            <strong>Equipe MediMap Angola</strong></p>
            <p>© 2023 MediMap Angola. Todos os direitos reservados.</p>
        </div>
    </div>
</body>
</html>` 

}
export { ResetPasswordTemplate}