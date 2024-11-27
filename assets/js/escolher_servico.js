// Obtém o ID e nome do cliente do sessionStorage
const cliente_id = sessionStorage.getItem('cliente_id');
const clienteNome = sessionStorage.getItem('nome');
console.log("cliente_id e clienteNome recuperados do sessionStorage:", cliente_id, clienteNome);

let servicosSelecionados = [];

// Exibe o nome do cliente na tela
if (clienteNome) {
    document.getElementById('nome').innerText = `Olá, ${clienteNome}! Seja bem-vindo!`;
} else {
    document.getElementById('nome').innerText = "Olá! Seja bem-vindo!";
}

// Função para carregar os serviços
async function carregarServicos() {
    try {
        const response = await fetch(`http://localhost:8000/cliente/escolher_servico/${cliente_id}`);
        if (response.ok) {
            const data = await response.json();
            console.log("Serviços carregados do backend:", data.servicos);
            exibirServicos(data.servicos);
        } else {
            alert("Erro ao carregar os serviços.");
        }
    } catch (error) {
        console.error("Erro ao carregar os serviços:", error);
        alert("Erro ao conectar com o servidor.");
    }
}

// Função para exibir os serviços na tela
function exibirServicos(servicos) {
    const servicosContainer = document.getElementById('servicosContainer');
    servicosContainer.innerHTML = "";

    servicos.forEach(servico => {
        const servicoDiv = document.createElement('div');
        servicoDiv.className = 'servico';
        servicoDiv.innerHTML = `
            <input type="checkbox" id="servico-${servico.id}" value="${servico.id}">
            <label for="servico-${servico.id}">${servico.nome} - R$ ${servico.preco.toFixed(2)}</label>
        `;
        servicosContainer.appendChild(servicoDiv);
    });
}

// Função para confirmar os serviços selecionados
document.getElementById('confirmarServicos').addEventListener('click', async () => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    servicosSelecionados = Array.from(checkboxes).map(checkbox => {
        return {
            id: checkbox.value,
            nome: checkbox.nextElementSibling.innerText.split(" - ")[0], // Extrai o nome do serviço
            preco: parseFloat(checkbox.nextElementSibling.innerText.split(" - R$ ")[1]) // Extrai o preço
        };
    });

    // Armazena os serviços selecionados no sessionStorage
    sessionStorage.setItem('servicosSelecionados', JSON.stringify(servicosSelecionados));

    try {
        for (const servicoId of servicosSelecionados) {
            const response = await fetch(`http://localhost:8000/cliente/escolher_servico/${cliente_id}/${servicoId.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ servico_id: servicoId.id }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.detail || "Erro ao selecionar serviço.");
                return;
            }
        }

        alert("Serviços escolhidos com sucesso!");
        window.location.href = 'resumo_pagamento.html';
    } catch (error) {
        console.error("Erro ao confirmar serviços:", error);
        alert("Erro ao conectar com o servidor.");
    }
});


// Carrega os serviços ao carregar a página
window.onload = carregarServicos;
