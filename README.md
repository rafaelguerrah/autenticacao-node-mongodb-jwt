# Autenticação Node.js com MongoDB e JWT

Este projeto é um sistema de autenticação completo usando Node.js, MongoDB e JSON Web Tokens (JWT). Inclui funcionalidades de cadastro, login e proteção de rotas, com um frontend responsivo.

## Funcionalidades

- **Cadastro de usuários**: Permite registrar novos usuários com nome, e-mail e senha.
- **Login**: Autenticação de usuários existentes.
- **Proteção de rotas**: Uso de JWT para proteger endpoints da API.
- **Frontend responsivo**: Interface moderna com design escuro e gradientes.
- **Validação de dados**: Verificação de campos obrigatórios e senhas.

## Tecnologias Utilizadas

- **Backend**:
  - Node.js
  - Express.js
  - MongoDB (com Mongoose)
  - bcryptjs (para hash de senhas)
  - jsonwebtoken (para JWT)
  - dotenv (para variáveis de ambiente)

- **Frontend**:
  - HTML5
  - CSS3 (com design responsivo)
  - JavaScript (ES6+)

## Pré-requisitos

- Node.js (versão 14 ou superior)
- MongoDB (local ou Atlas)
- npm ou yarn

## Instalação

1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   cd autenticacao-node-mongodb-jwt
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:
     ```
     DB_USER=seu_usuario_mongodb
     DB_PASS=sua_senha_mongodb
     SECRET=sua_chave_secreta_jwt
     PORT=3001
     ```
   - Para MongoDB Atlas, substitua `DB_USER` e `DB_PASS` pelas credenciais do seu cluster.

4. Configure o banco de dados:
   - Se usar MongoDB local, certifique-se de que está rodando na porta padrão (27017).
   - Para Atlas, atualize a string de conexão em `config/db.js` se necessário.

## Executando o Projeto

1. Inicie o servidor:
   ```bash
   npm start
   ```

2. Abra o navegador e acesse `http://localhost:3001`

## Estrutura do Projeto

```
autenticacao-node-mongodb-jwt/
├── app.js                 # Arquivo principal do servidor
├── config/
│   └── db.js              # Configuração da conexão com MongoDB
├── controllers/
│   ├── authController.js  # Lógica de autenticação
│   └── userController.js  # Lógica de usuários
├── middlewares/
│   └── authMiddleware.js  # Middleware de autenticação JWT
├── models/
│   └── User.js            # Modelo de usuário
├── public/
│   ├── index.html         # Página principal (frontend)
│   ├── script.js          # JavaScript do frontend
│   └── styles.css         # Estilos CSS
├── routes/
│   ├── authRoutes.js      # Rotas de autenticação
│   └── userRoutes.js      # Rotas de usuários
└── utils/                 # Utilitários (se houver)
```

## API Endpoints

### Autenticação
- `POST /auth/register`: Cadastrar novo usuário
  - Body: `{ "name": "Nome", "email": "email@example.com", "password": "senha", "confirmpassword": "senha" }`
- `POST /auth/login`: Fazer login
  - Body: `{ "email": "email@example.com", "password": "senha" }`

### Usuários
- `GET /users/:id`: Obter dados de um usuário (requer token)
- `GET /users/me`: Obter dados do usuário logado (requer token)

## Frontend

O frontend é uma aplicação single-page com três telas:

1. **Login**: Formulário para fazer login
2. **Cadastro**: Formulário para registrar novo usuário
3. **Boas-vindas**: Tela exibida após login, mostrando nome e e-mail do usuário

### Funcionalidades do Frontend

- Alternância entre telas de login e cadastro
- Validação de formulários
- Armazenamento do token JWT no localStorage
- Logout automático ao clicar em "Sair"

## Segurança

- Senhas são hasheadas com bcrypt
- Tokens JWT têm expiração automática
- Middleware protege rotas sensíveis
- Validação de entrada de dados

## Desenvolvimento

Para desenvolvimento, use:
```bash
npm run dev  # Se configurado com nodemon
```

O nodemon reinicia o servidor automaticamente ao detectar mudanças nos arquivos.

## Troubleshooting

### Erro de conexão com MongoDB
- Verifique se as credenciais no `.env` estão corretas
- Para Atlas, certifique-se de que o IP está na whitelist
- Verifique se o cluster não está pausado

### Erro de autenticação
- Confirme se o usuário existe no banco
- Verifique se a senha está correta
- Certifique-se de que o token JWT não expirou

### Frontend não carrega
- Verifique se o servidor está rodando na porta 3001
- Abra o console do navegador para erros JavaScript

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.