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
const editBtn = document.getElementById('editBtn');
const deleteBtn = document.getElementById('deleteBtn');
const editCard = document.getElementById('editCard');
const editForm = document.getElementById('editForm');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const editMessage = document.getElementById('editMessage');
const editName = document.getElementById('editName');
const editEmail = document.getElementById('editEmail');
const editPassword = document.getElementById('editPassword');
const editConfirmPassword = document.getElementById('editConfirmPassword');

let currentUser = null;

const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');

// Funções para alternar telas
function showLoginScreen() {
  loginCard.style.display = 'block';
  registerCard.style.display = 'none';
  editCard.style.display = 'none';
  welcomeCard.style.display = 'none';
  welcomeMessage.textContent = '';
  welcomeMessage.classList.remove('error');
}

function showRegisterScreen() {
  loginCard.style.display = 'none';
  registerCard.style.display = 'block';
  editCard.style.display = 'none';
  welcomeCard.style.display = 'none';
  welcomeMessage.textContent = '';
  welcomeMessage.classList.remove('error');
}

function showWelcomeScreen(user) {
  currentUser = user;
  userName.textContent = user.name;
  userEmail.textContent = user.email;
  loginCard.style.display = 'none';
  registerCard.style.display = 'none';
  editCard.style.display = 'none';
  welcomeCard.style.display = 'block';
  welcomeMessage.textContent = '';
  welcomeMessage.classList.remove('error');
}

function showEditScreen() {
  if (!currentUser) return;
  editName.value = currentUser.name || '';
  editEmail.value = currentUser.email || '';
  editPassword.value = '';
  editConfirmPassword.value = '';
  editMessage.textContent = '';
  editMessage.classList.remove('error');
  loginCard.style.display = 'none';
  registerCard.style.display = 'none';
  welcomeCard.style.display = 'none';
  editCard.style.display = 'block';
}

function cancelEdit() {
  editCard.style.display = 'none';
  editMessage.textContent = '';
  editMessage.classList.remove('error');
  if (currentUser) {
    showWelcomeScreen(currentUser);
  } else {
    showLoginScreen();
  }
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

// Editar perfil
editBtn.addEventListener('click', () => {
  showEditScreen();
});

cancelEditBtn.addEventListener('click', () => {
  cancelEdit();
});

// Excluir conta
deleteBtn.addEventListener('click', async () => {
  if (!currentUser) return;

  const confirmed = confirm('Deseja realmente excluir sua conta? Essa ação não pode ser desfeita.');
  if (!confirmed) return;

  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`/users/${currentUser._id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      welcomeMessage.textContent = data.msg || 'Erro ao excluir conta.';
      welcomeMessage.classList.add('error');
      return;
    }

    localStorage.removeItem('token');
    currentUser = null;
    showLoginScreen();
    alert('Conta excluída com sucesso.');
  } catch (error) {
    welcomeMessage.textContent = 'Erro ao conectar no servidor.';
    welcomeMessage.classList.add('error');
    console.error(error);
  }
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

// Formulário de edição
editForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  editMessage.textContent = '';
  editMessage.classList.remove('error');

  if (!currentUser) {
    editMessage.textContent = 'Usuário não encontrado.';
    editMessage.classList.add('error');
    return;
  }

  const name = editName.value.trim();
  const email = editEmail.value.trim();
  const password = editPassword.value;
  const confirmpassword = editConfirmPassword.value;

  if (!name || !email) {
    editMessage.textContent = 'Nome e e-mail são obrigatórios.';
    editMessage.classList.add('error');
    return;
  }

  if (password && password !== confirmpassword) {
    editMessage.textContent = 'As senhas não coincidem.';
    editMessage.classList.add('error');
    return;
  }

  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`/users/${currentUser._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name, email, password, confirmpassword })
    });

    const data = await response.json();

    if (!response.ok) {
      editMessage.textContent = data.msg || 'Erro ao atualizar usuário.';
      editMessage.classList.add('error');
      return;
    }

    currentUser = data.user || currentUser;
    showWelcomeScreen(currentUser);
    welcomeMessage.textContent = 'Perfil atualizado com sucesso.';
    welcomeMessage.classList.remove('error');
  } catch (error) {
    editMessage.textContent = 'Não foi possível conectar ao servidor.';
    editMessage.classList.add('error');
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
