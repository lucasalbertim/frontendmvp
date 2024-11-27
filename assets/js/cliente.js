async function loginCliente() {
    const cpf = document.getElementById("cpf").value;
    const telefone = document.getElementById("telefone").value;
    const loginMessage = document.getElementById("login-message");

    try {
        const response = await fetch("http://localhost:8000/login_cliente", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ cpf, telefone })
        });
        
        const data = await response.json();
        console.log("Resposta completa do backend:", data);

        if (response.ok) {
            // Armazena o ID e o nome do cliente no sessionStorage
            sessionStorage.setItem('cliente_id', data.cliente_id);
            sessionStorage.setItem("nome", data.nome);
            console.log("Dados armazenados no sessionStorage:", {
                cliente_id: data.cliente_id,
                nome: data.nome
            });

            loginMessage.textContent = data.message;
            setTimeout(() => {
                window.location.href = "escolher_servico.html";
            }, 100);
        } else {
            loginMessage.textContent = data.detail || "Erro ao fazer login.";
        }
    } catch (error) {
        console.error("Erro:", error);
        loginMessage.textContent = "Erro ao conectar com o servidor.";
    }
}
