async function cadastroCliente() {
    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const telefone = document.getElementById('telefone').value;

    const response = await fetch('http://localhost:8000/cliente/cadastro_cliente', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, cpf, telefone }),
    });

    if (response.ok) {
        const data = await response.json();
        alert(data.message);
        window.location.href = 'login_cliente.html'; // Redireciona para a tela de login
    } else {
        loginMessage.textContent = data.detail || "Erro ao fazer cadastro.";
        const errorData = await response.json();
        alert(errorData.detail);
        
    }
}
