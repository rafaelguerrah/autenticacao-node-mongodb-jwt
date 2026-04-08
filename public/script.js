// Elementos
const loginCard = document.getElementById('loginCard');
const registerCard = document.getElementById('registerCard');
const welcomeCard = document.getElementById('welcomeCard');

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const logoutBtn = document.getElementById('logoutBtn');

const loginMessage = document.getElementById('loginMessage');
const registerMessage = document.getElementById('registerMessage');
const welcomeMessage = document.getElementById('welcomeMessage');

const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');

const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');

// Funções para alternar telas
function showLoginScreen() {
  loginCard.style.display = 'block';
  registerCard.style.display = 'none';
  welcomeCard.style.display = 'none';
}

function showRegisterScreen() {
  loginCard.style.display = 'none';
  registerCard.style.display = 'block';
  welcomeCard.style.display = 'none';
}

function showWelcomeScreen(user) {
  userName.textContent = user.name;
  userEmail.textContent = user.email;
  loginCard.style.display = 'none';
  registerCard.style.display = 'none';
  welcomeCard.style.display = 'block';
}

// Eventos para alternar telas
showRegister.addEventListener('click', (e) => {
  e.preventDefault();
  showRegisterScreen();
});

showLogin.addEventListener('click', (e) => {
  e.preventDefault();
  showLoginScreen();
});

// Logout
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  showLoginScreen();
});

// Formulário de Login
loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  loginMessage.textContent = '';
  loginMessage.classList.remove('error');

  const email = loginForm.email.value.trim();
  const password = loginForm.password.value;

  if (!email || !password) {
    loginMessage.textContent = 'Preencha e-mail e senha.';
    loginMessage.classList.add('error');
    return;
  }

  try {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      loginMessage.textContent = data.msg || 'Erro ao tentar fazer login.';
      loginMessage.classList.add('error');
      return;
    }

    localStorage.setItem('token', data.token);

    // Buscar dados do usuário
    const userResponse = await fetch('/users/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${data.token}`
      }
    });

    if (userResponse.ok) {
      const userData = await userResponse.json();
      showWelcomeScreen(userData);
    } else {
      const errorData = await userResponse.json().catch(() => ({}));
      loginMessage.textContent = `Login realizado, mas erro ao buscar dados: ${userResponse.status} - ${errorData.msg || 'Erro desconhecido'}`;
      loginMessage.classList.add('error');
    }
  } catch (error) {
    loginMessage.textContent = 'Não foi possível conectar ao servidor.';
    loginMessage.classList.add('error');
    console.error(error);
  }
});

// Formulário de Cadastro
registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  registerMessage.textContent = '';
  registerMessage.classList.remove('error');

  const name = registerForm.name.value.trim();
  const email = registerForm.email.value.trim();
  const password = registerForm.password.value;
  const confirmpassword = registerForm.confirmpassword.value;

  if (!name || !email || !password || !confirmpassword) {
    registerMessage.textContent = 'Preencha todos os campos.';
    registerMessage.classList.add('error');
    return;
  }

  if (password !== confirmpassword) {
    registerMessage.textContent = 'As senhas não coincidem.';
    registerMessage.classList.add('error');
    return;
  }

  try {
    const response = await fetch('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password, confirmpassword })
    });

    const data = await response.json();

    if (!response.ok) {
      registerMessage.textContent = data.msg || 'Erro ao tentar cadastrar.';
      registerMessage.classList.add('error');
      return;
    }

    registerMessage.textContent = 'Cadastro realizado com sucesso! Faça login.';
    registerMessage.classList.remove('error');
    setTimeout(() => showLoginScreen(), 2000);
  } catch (error) {
    registerMessage.textContent = 'Não foi possível conectar ao servidor.';
    registerMessage.classList.add('error');
    console.error(error);
  }
});

// Verificar se já está logado
const token = localStorage.getItem('token');
if (token) {
  // Tentar buscar dados do usuário
  fetch('/users/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Token inválido');
    }
  })
  .then(user => {
    showWelcomeScreen(user);
  })
  .catch(() => {
    localStorage.removeItem('token');
    showLoginScreen();
  });
} else {
  showLoginScreen();
}
