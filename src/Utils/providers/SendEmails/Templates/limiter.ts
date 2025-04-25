
const LimiterTemplate:string = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Limite de Tentativas Excedido | Segurança da Conta</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        :root {
            --primary: #E74C3C;
            --primary-dark: #C0392B;
            --secondary: #3498DB;
            --text: #2C3E50;
            --text-light: #7F8C8D;
            --bg: #F9FAFB;
            --card-bg: #FFFFFF;
            --border-radius: 16px;
            --box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: var(--bg);
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            color: var(--text);
            line-height: 1.6;
        }
        
        .security-card {
            background: var(--card-bg);
            padding: 2.5rem;
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            text-align: center;
            max-width: 480px;
            width: 90%;
            margin: 2rem;
            position: relative;
            overflow: hidden;
            border: 1px solid rgba(0, 0, 0, 0.03);
            transform: translateY(0);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .security-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
        }
        
        .security-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(231, 76, 60, 0.1);
            border-radius: 50%;
            animation: pulse 2s infinite;
        }
        
        .security-icon svg {
            width: 40px;
            height: 40px;
            fill: var(--primary);
        }
        
        h1 {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--primary);
            margin-bottom: 1rem;
            letter-spacing: -0.5px;
        }
        
        .subtitle {
            font-size: 1.1rem;
            color: var(--text-light);
            margin-bottom: 1.5rem;
            font-weight: 400;
            max-width: 380px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .timer-display {
            display: inline-block;
            background: rgba(231, 76, 60, 0.1);
            color: var(--primary);
            padding: 0.5rem 1rem;
            border-radius: 50px;
            font-weight: 600;
            margin: 1rem 0;
            font-size: 0.9rem;
        }
        
        .action-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
            color: white;
            background-color: var(--secondary);
            padding: 0.8rem 2rem;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            margin-top: 1rem;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(52, 152, 219, 0.2);
        }
        
        .action-btn:hover {
            background-color: #2980B9;
            transform: translateY(-2px);
            box-shadow: 0 7px 14px rgba(52, 152, 219, 0.3);
        }
        
        .action-btn svg {
            width: 18px;
            height: 18px;
            margin-right: 8px;
            fill: currentColor;
        }
        
        .security-footer {
            margin-top: 2rem;
            font-size: 0.85rem;
            color: var(--text-light);
            border-top: 1px solid rgba(0, 0, 0, 0.05);
            padding-top: 1.5rem;
        }
        
        .security-footer a {
            color: var(--secondary);
            text-decoration: none;
            font-weight: 500;
        }
        
        .decoration {
            position: absolute;
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, rgba(231, 76, 60, 0.05) 0%, rgba(0,0,0,0) 70%);
            border-radius: 50%;
            z-index: 0;
        }
        
        .decoration-1 {
            top: -100px;
            right: -100px;
        }
        
        .decoration-2 {
            bottom: -80px;
            left: -80px;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.8; }
            100% { transform: scale(1); opacity: 1; }
        }
        
        @media (max-width: 480px) {
            .security-card {
                padding: 1.8rem;
            }
            
            h1 {
                font-size: 1.5rem;
            }
            
            .subtitle {
                font-size: 1rem;
            }
        }
    </style>
</head>
<body>
    <div class="security-card">
        <div class="decoration decoration-1"></div>
        <div class="decoration decoration-2"></div>
        
        <div class="security-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11V11.99z"/>
                <path d="M11 7h2v6h-2zm0 8h2v2h-2z"/>
            </svg>
        </div>
        
        <h1>Limite de Segurança Atingido</h1>
        <p class="subtitle">Por motivos de segurança, sua conta foi temporariamente bloqueada devido a múltiplas tentativas de acesso.</p>
        
        <div class="timer-display">
            ⏳ Tente novamente em: <span id="countdown">15:00</span>
        </div>
        
        <button class="action-btn" onclick="window.location.href='/login'" disabled id="retryBtn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
            </svg>
            Tentar Novamente
        </button>
        
        <div class="security-footer">
            Precisa de ajuda? <a href="/support">Entre em contato com nosso suporte</a>
        </div>
    </div>

    <script src="./Bubble.js"></script>
</body>
</html>
`

export {LimiterTemplate}