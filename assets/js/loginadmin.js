document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Impede o envio do formulário padrão
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    const response = await fetch('/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });
  
    const data = await response.json();
  
    if (response.ok && data.success) {
      // Redireciona para a página de admin
      window.location.href = '/admin/dashboard';
    } else {
      // Exibe a mensagem de erro
      document.getElementById('error-message').style.display = 'block';
    }
  });
  