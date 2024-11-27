// Obtém o ID e o nome do cliente do sessionStorage
const cliente_id = sessionStorage.getItem('cliente_id');
const clienteNome = sessionStorage.getItem('nome');

// Exibe o nome do cliente na tela
document.getElementById('nome').innerText = `Olá, ${clienteNome}! Aqui está o resumo do seu pagamento:`;

// Função para carregar os serviços selecionados e calcular o total
async function carregarResumo() {
    const servicosSelecionados = JSON.parse(sessionStorage.getItem('servicosSelecionados')) || [];

    // Exibe os serviços selecionados
    const servicosContainer = document.getElementById('servicosSelecionadosContainer');
    servicosContainer.innerHTML = '';  // Limpa o container para evitar duplicação
    let total = 0;

    servicosSelecionados.forEach(servico => {
        const servicoDiv = document.createElement('div');
        servicoDiv.className = 'servico';
        servicoDiv.innerHTML = `${servico.nome} - R$ ${servico.preco.toFixed(2)}`;
        servicosContainer.appendChild(servicoDiv);
        total += servico.preco;
    });

    // Atualiza o total no DOM
    document.getElementById('total').innerText = total.toFixed(2);
}

// Função para confirmar o pagamento
document.getElementById('confirmarPagamento').addEventListener('click', async () => {
    const formaPagamento = document.getElementById('formaPagamento').value;
    const servicosSelecionados = JSON.parse(sessionStorage.getItem('servicosSelecionados')) || [];
    const total = parseFloat(document.getElementById('total').innerText);

    if (!formaPagamento) {
        document.getElementById('mensagemPagamento').innerText = "Por favor, selecione uma forma de pagamento.";
        return;
    }

    try {
        const response = await fetch(`http://localhost:8000/cliente/${cliente_id}/confirmar_pagamento`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                servicos: servicosSelecionados.map(servico => servico.id),
                total: total,
                forma_pagamento: formaPagamento
            }),
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('mensagemPagamento').innerText = data.message || "Pagamento confirmado com sucesso!";
            // Aqui pode redirecionar para uma tela de confirmação final, caso necessário
            setTimeout(() => {
                window.location.href = "resumo_final.html";  // Redireciona para a próxima página
            }, 1000);
        } else {
            const errorData = await response.json();
            document.getElementById('mensagemPagamento').innerText = errorData.detail || "Erro ao confirmar o pagamento.";
        }
    } catch (error) {
        console.error("Erro ao confirmar o pagamento:", error);
        document.getElementById('mensagemPagamento').innerText = "Erro ao conectar com o servidor.";
    }
});

// Carrega o resumo ao carregar a página
window.onload = carregarResumo;
