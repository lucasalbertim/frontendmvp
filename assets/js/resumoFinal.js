// Obtém o ID e nome do cliente do sessionStorage
const cliente_id = sessionStorage.getItem('cliente_id');
const clienteNome = sessionStorage.getItem('nome');
const totalPago = sessionStorage.getItem('totalPago');  // Total pago, armazenado no sessionStorage
const formaPagamento = sessionStorage.getItem('formaPagamento');  // Forma de pagamento
const servicosSelecionados = JSON.parse(sessionStorage.getItem('servicosSelecionados')) || [];

// Exibe o nome do cliente na tela
document.getElementById('nomeCliente').innerText = `Olá, ${clienteNome}! Aqui está o resumo do seu pagamento:`;

// Exibe o total pago e a forma de pagamento
document.getElementById('totalPago').innerText = totalPago.toFixed(2);
document.getElementById('formaPagamento').innerText = formaPagamento;

// Exibe os serviços selecionados
const servicosContainer = document.getElementById('servicosSelecionadosContainer');
servicosSelecionados.forEach(servico => {
    const servicoDiv = document.createElement('div');
    servicoDiv.className = 'servico';
    servicoDiv.innerHTML = `${servico.nome} - R$ ${servico.preco.toFixed(2)}`;
    servicosContainer.appendChild(servicoDiv);
});

// Mensagem final de pagamento
document.getElementById('mensagemPagamento').innerText = "Seu pagamento foi realizado com sucesso!";

// Função para finalizar o pagamento
document.getElementById('finalizarPagamento').addEventListener('click', () => {
    // Monta o objeto para enviar
    const servicosIds = servicosSelecionados.map(servico => servico.id);  // IDs dos serviços
    const pagamentoData = {
        servicos: servicosIds,  // Removido cliente_id daqui
        total: totalPago,
        forma_pagamento: formaPagamento
    };

    // Envia a solicitação para o backend confirmar o pagamento
    fetch(`/cliente/${cliente_id}/confirmar_pagamento`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(pagamentoData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Pagamento confirmado com sucesso!") {
            alert("Pagamento realizado com sucesso!");
            window.location.href = "login_cliente.html";  // Redireciona para a página inicial
        } else {
            alert("Erro ao confirmar o pagamento.");
        }
    })
    .catch(error => {
        console.error("Erro:", error);
        alert("Erro ao confirmar o pagamento.");
    });
});
