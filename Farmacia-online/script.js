console.log('Bem-vindo ao JavaScript da sua Farmácia Online!');
console.log('Conectando ao backend...');

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

    // Função para buscar e exibir produtos do backend
    async function fetchAndDisplayProducts() {
        const listaProdutosContainer = document.querySelector('.lista-produtos');
        if (!listaProdutosContainer) {
            console.error('Elemento .lista-produtos não encontrado.');
            return;
        }

        listaProdutosContainer.innerHTML = 'Carregando produtos...';

        try {
            // CORRIGIDO AQUI: A URL da API do backend é '/api/products'
            const response = await fetch(`${API_BASE_URL}/api/products`); 
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const products = await response.json();

            listaProdutosContainer.innerHTML = ''; // Limpa "Carregando..."

            if (products.length === 0) {
                listaProdutosContainer.innerHTML = '<p>Nenhum produto encontrado no momento. Adicione produtos no seu Supabase!</p>';
            } else {
                products.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.classList.add('produto-card');
                    productCard.innerHTML = `
                        <img src="${product.imagem_url || 'placeholder.jpg'}" alt="${product.nome}" style="width:100%; max-width:150px; height:auto; margin-bottom: 10px; border-radius: 5px;">
                        <h3>${product.nome}</h3>
                        <p>${product.descricao || 'Produto de alta qualidade para a sua saúde.'}</p>
                        <p class="preco">R$ ${product.preco ? product.preco.toFixed(2).replace('.', ',') : 'N/A'}</p>
                        <button class="adicionar-carrinho" data-id="${product.id}">Adicionar ao Carrinho</button>
                    `;
                    listaProdutosContainer.appendChild(productCard);
                });
            }

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
        let contadorCarrinho = parseInt(localStorage.getItem('cartCount') || '0', 10);
        if (carrinhoLink) {
            carrinhoLink.innerText = `Carrinho (${contadorCarrinho})`;
        }

        botoesAdicionarCarrinho.forEach(button => {
            button.removeEventListener('click', handleAddToCart); // Evita duplicação
            button.addEventListener('click', handleAddToCart);
        });

        function handleAddToCart(event) {
            const produtoId = event.target.dataset.id;
            const nomeProduto = event.target.parentNode.querySelector('h3').innerText;

            contadorCarrinho++;
            localStorage.setItem('cartCount', contadorCarrinho);
            if (carrinhoLink) {
                carrinhoLink.innerText = `Carrinho (${contadorCarrinho})`;
            }

            console.log(`Produto "${nomeProduto}" (ID: ${produtoId}) adicionado ao carrinho!`);
            alert(`"${nomeProduto}" adicionado ao carrinho! Total: ${contadorCarrinho} itens.`);
        }
    }

    // 3. Funcionalidade básica do formulário de contato
    const formContato = document.querySelector('#contato form');

    if (formContato) {
        formContato.addEventListener('submit', async (event) => {
            event.preventDefault();

            const nome = formContato.querySelector('input[type="text"]').value;
            const email = formContato.querySelector('input[type="email"]').value;
            const mensagem = formContato.querySelector('textarea').value;

            if (nome && email && mensagem) {
                console.log('Tentando enviar mensagem...');
                try {
                    // Exemplo de envio de dados para o backend via API
                    // Lembre-se: Você precisaria criar uma rota /api/contact no seu server.js para isso!
                    const response = await fetch(`${API_BASE_URL}/api/contact`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ nome, email, mensagem }),
                    });

                    if (response.ok) {
                        alert('Sua mensagem foi enviada com sucesso! Em breve entraremos em contato.');
                        formContato.reset();
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