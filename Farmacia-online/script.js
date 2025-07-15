// Mensagem de boas-vindas no console do navegador
console.log('Bem-vindo ao JavaScript da sua Farmácia Online!');
console.log('Conectando ao backend...'); // Nova mensagem

// URL base do seu backend Node.js
const API_BASE_URL = 'http://localhost:3000';

// 1. Funcionalidade do botão "Ver Produtos" do banner
document.addEventListener('DOMContentLoaded', () => {
    const verProdutosBtn = document.querySelector('#banner-promocional button');
    const secaoProdutos = document.querySelector('#produtos');

    if (verProdutosBtn && secaoProdutos) {
        verProdutosBtn.addEventListener('click', () => {
            secaoProdutos.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // ----------------------------------------------------
    // NOVO: Função para buscar e exibir produtos do backend
    // ----------------------------------------------------
    async function fetchAndDisplayProducts() {
        const listaProdutosContainer = document.querySelector('.lista-produtos');
        if (!listaProdutosContainer) {
            console.error('Elemento .lista-produtos não encontrado.');
            return;
        }

        // Limpa os produtos estáticos existentes no HTML
        listaProdutosContainer.innerHTML = 'Carregando produtos...';

        try {
            // Faz a requisição para a API do backend
            const response = await fetch(`${API_BASE_URL}/api/products`);
            // Verifica se a resposta foi bem-sucedida (status 200 OK)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Converte a resposta para JSON
            const products = await response.json();

            // Limpa o "Carregando produtos..."
            listaProdutosContainer.innerHTML = '';

            // Itera sobre os produtos recebidos e cria os cards dinamicamente
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('produto-card');
                productCard.innerHTML = `
                    <img src="${product.imageUrl}" alt="${product.name}" style="width:100%; max-width:150px; height:auto; margin-bottom: 10px; border-radius: 5px;">
                    <h3>${product.name}</h3>
                    <p>${product.description || 'Produto de alta qualidade para a sua saúde.'}</p>
                    <p class="preco">R$ ${product.price.toFixed(2).replace('.', ',')}</p>
                    <button class="adicionar-carrinho" data-id="${product.id}">Adicionar ao Carrinho</button>
                `;
                listaProdutosContainer.appendChild(productCard);
            });

            // Re-anexa os event listeners aos novos botões gerados dinamicamente
            attachAddToCartListeners();

        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            listaProdutosContainer.innerHTML = '<p>Erro ao carregar produtos. Por favor, tente novamente mais tarde.</p>';
        }
    }

    // Função para anexar event listeners aos botões de adicionar ao carrinho
    function attachAddToCartListeners() {
        const botoesAdicionarCarrinho = document.querySelectorAll('.adicionar-carrinho');
        const carrinhoLink = document.querySelector('header nav ul li a[href="#carrinho"]');
        // Inicializa o contador do carrinho. Em um app real, ele viria do backend/localStorage
        let contadorCarrinho = parseInt(localStorage.getItem('cartCount') || '0', 10);
        if (carrinhoLink) {
            carrinhoLink.innerText = `Carrinho (${contadorCarrinho})`; // Atualiza o texto inicial
        }

        botoesAdicionarCarrinho.forEach(button => {
            // Remove qualquer listener anterior para evitar duplicação se a função for chamada novamente
            button.removeEventListener('click', handleAddToCart);
            // Adiciona o novo listener
            button.addEventListener('click', handleAddToCart);
        });

        function handleAddToCart(event) {
            const produtoId = event.target.dataset.id;
            const nomeProduto = event.target.parentNode.querySelector('h3').innerText;

            contadorCarrinho++; // Incrementa o contador
            localStorage.setItem('cartCount', contadorCarrinho); // Salva no armazenamento local do navegador
            if (carrinhoLink) {
                carrinhoLink.innerText = `Carrinho (${contadorCarrinho})`; // Atualiza o texto do link
            }

            console.log(`Produto "${nomeProduto}" (ID: ${produtoId}) adicionado ao carrinho!`);
            alert(`"${nomeProduto}" adicionado ao carrinho! Total: ${contadorCarrinho} itens.`);

            // Futuramente, aqui você enviaria os dados para o seu backend (Node.js)
            // para realmente adicionar o produto ao carrinho de compras do usuário no servidor.
            // Exemplo (apenas para ilustrar, não implementado totalmente aqui):
            // fetch(`${API_BASE_URL}/api/add-to-cart`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ productId: produtoId, quantity: 1 })
            // });
        }
    }


    // 3. Funcionalidade básica do formulário de contato (apenas para demonstração)
    const formContato = document.querySelector('#contato form');

    if (formContato) {
        formContato.addEventListener('submit', async (event) => { // Adicionado 'async' aqui
            event.preventDefault(); // Impede o envio padrão do formulário (que recarregaria a página)

            const nome = formContato.querySelector('input[type="text"]').value;
            const email = formContato.querySelector('input[type="email"]').value;
            const mensagem = formContato.querySelector('textarea').value;

            if (nome && email && mensagem) {
                console.log('Tentando enviar mensagem...');
                try {
                    // Exemplo de envio de dados para o backend via API
                    const response = await fetch(`${API_BASE_URL}/api/contact`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ nome, email, mensagem }),
                    });

                    if (response.ok) {
                        alert('Sua mensagem foi enviada com sucesso! Em breve entraremos em contato.');
                        formContato.reset(); // Limpa o formulário
                    } else {
                        throw new Error(`Erro ao enviar mensagem: ${response.statusText}`);
                    }
                } catch (error) {
                    console.error('Erro ao enviar formulário de contato:', error);
                    alert('Houve um erro ao enviar sua mensagem. Por favor, tente novamente.');
                }

            } else {
                alert('Por favor, preencha todos os campos do formulário.');
            }
        });
    }

    // Chama a função para buscar e exibir os produtos quando a página carrega
    fetchAndDisplayProducts();
});