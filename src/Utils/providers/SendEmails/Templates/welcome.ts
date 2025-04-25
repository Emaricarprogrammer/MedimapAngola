function WelcomeHtmlTemplate(email?: string, firma?: string): string {
  const recipient = email || firma || 'Prezado(a) Cliente';
  
  return `
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bem-vindo à MedMap Angola</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            color: #2a7f62;
            text-align: center;
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 15px;
        }
        .content {
            padding: 20px 0;
        }
        .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 2px solid #f0f0f0;
            font-size: 14px;
            color: #666;
        }
        .highlight {
            color: #2a7f62;
            font-weight: bold;
        }
        .emoji {
            font-size: 1.2em;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 20px 0;
            background-color: #2a7f62;
            color: white !important;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Bem-vindo(a) <span class="highlight">${recipient}</span> à MedMap Angola! <span class="emoji">🌟</span></h1>
    </div>
    
    <div class="content">
        <p>Olá! <span class="emoji">👋</span></p>
        
        <p>É com grande entusiasmo que damos as boas-vindas à nossa plataforma! <span class="emoji">🎉</span></p>
        
        <p>
            Na MedMap Angola, estamos comprometidos em revolucionar a forma como você gerencia e adquire medicamentos, 
            oferecendo soluções inteligentes que simplificam seu trabalho e melhoram a eficiência operacional.
        </p>
        
        <p>
            <strong>O que você pode esperar:</strong>
        </p>
        <ul>
            <li>Plataforma intuitiva e fácil de usar</li>
            <li>Gestão simplificada de estoque de medicamentos</li>
            <li>Processos de aquisição mais ágeis</li>
            <li>Suporte dedicado para suas necessidades</li>
        </ul>
        
        <p>
            Nossa equipe está sempre disponível para ajudar. Não hesite em entrar em contato se tiver 
            qualquer dúvida ou precisar de assistência.
        </p>
        
        <p style="text-align: center;">
            <a href="https://www.medmap.ao" class="button">Acesse sua conta agora</a>
        </p>
        
        <p style="text-align: center; font-style: italic;">
            <span class="emoji">✨</span> Juntos, estamos transformando o futuro da gestão farmacêutica! <span class="emoji">✨</span>
        </p>
    </div>
    
    <div class="footer">
        <p>Atenciosamente,<br>
        <strong>Equipe MedMap Angola</strong> <span class="emoji">💚</span></p>
        
        <p>
            <small>
                Caso não reconheça esta ação, por favor ignore este e-mail ou entre em contato conosco.
            </small>
        </p>
    </div>
</body>
</html>
`;
}

export { WelcomeHtmlTemplate };