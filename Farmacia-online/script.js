// Farmacia-online/script.js

// URL base do seu backend Node.js
const API_BASE_URL = 'http://localhost:3000'; // Não mude esta URL

// Função para buscar e exibir produtos
async function fetchAndDisplayProducts() {
    // Seleciona o div que conterá a lista de produtos (no index.html ou produtos.html)
    const listaProdutosDiv = document.querySelector('.lista-produtos');

    // Verifica se o elemento '.lista-produtos' existe na página atual.
    // Isso evita erros se a função for chamada em uma página que não tem essa div.
    if (!listaProdutosDiv) {
        console.warn('Elemento .lista-produtos não encontrado na página atual. Pulando a busca de produtos.');
        return; // Sai da função se o elemento não existe
    }

    // Limpa qualquer conteúdo estático e mostra uma mensagem de carregamento
    listaProdutosDiv.innerHTML = '<h2>Carregando produtos...</h2>';

    try {
        const response = await fetch(`${API_BASE_URL}/api/products`);
        if (!response.ok) {
            // Se a resposta não for OK (ex: 500 Internal Server Error, 404 Not Found, etc.)
            const errorText = await response.text(); // Tenta pegar a mensagem de erro do backend
            throw new Error(`HTTP error! Status: ${response.status}. Mensagem do servidor: ${errorText || 'Sem mensagem'}`);
        }
        const products = await response.json();

        // Limpa a mensagem de carregamento antes de adicionar os produtos
        listaProdutosDiv.innerHTML = '';

        if (products.length === 0) {
            listaProdutosDiv.innerHTML = '<p>Nenhum produto encontrado no momento.</p>';
        } else {
            products.forEach(product => {
                const productCard = `
                    <div class="produto-card">
                        <img src="${product.imagem_url || 'https://via.placeholder.com/150'}" alt="${product.nome}">
                        <h3>${product.nome}</h3>
                        <p>${product.descricao}</p>
                        <p class="preco">R$ ${product.preco.toFixed(2).replace('.', ',')}</p>
                        <button class="adicionar-carrinho" data-id="${product.id}">Adicionar ao Carrinho</button>
                    </div>
                `;
                listaProdutosDiv.innerHTML += productCard;
            });
        }
    } catch (error) {
        console.error('Erro ao buscar produtos:', error); // Loga o erro no console do navegador
        // Exibe uma mensagem de erro no HTML para o usuário
        listaProdutosDiv.innerHTML = `<p style="color: red;">Não foi possível carregar os produtos. Erro: ${error.message}. Por favor, verifique o terminal do backend.</p>`;
    }
}

// Lógica para carregar produtos quando a página é completamente carregada
document.addEventListener('DOMContentLoaded', () => {
    // Chama a função para buscar e exibir produtos em qualquer página que tenha '.lista-produtos'
    fetchAndDisplayProducts();

    // Listener para o botão "Ver produtos" na página inicial (se houver)
    const verProdutosButton = document.querySelector('.botao-vermelho');
    if (verProdutosButton) {
        verProdutosButton.addEventListener('click', (event) => {
            event.preventDefault(); // Impede o comportamento padrão do link
            window.location.href = 'produtos.html'; // Redireciona para a página de produtos
        });
    }

    // Listener para os botões "Adicionar ao Carrinho"
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('adicionar-carrinho')) {
            const productId = event.target.dataset.id;
            console.log(`Produto ${productId} adicionado ao carrinho! (Simulação)`);
            // Futuramente, você adicionaria a lógica real do carrinho aqui.
        }
    });

    // Outras lógicas para outras seções ou interações de UI podem vir aqui.
});