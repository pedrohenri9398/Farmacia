// Importa o módulo Express
const express = require('express');
// Importa o módulo CORS para permitir requisições de diferentes origens (seu frontend)
const cors = require ('cors');

// Cria uma instância do aplicativo Express
const app = express();
// Define a porta em que o servidor irá rodar. Usa a porta do ambiente ou 3000 por padrão.
// CORREÇÃO: Usar process.env.PORT com um PONTO, não vírgula.
const PORT = process.env.PORT || 3000;

// --- Middleware (funções que processam requisições) ---

// Habilita o CORS para todas as requisições. Isso é crucial para que seu frontend possa se comunicar com este backend.
app.use(cors());

// Habilita o uso de JSON no corpo das requisições (para receber dados do frontend, como um novo produto ou pedido)
app.use(express.json());

// --- Rotas (Endpoints da API) ---

// Rota inicial para verificar se o servidor está funcionando
app.get('/', (req, res) => {
    res.send('Bem-vindo à API da Farmácia Online!'); // Corrigi "vinso" para "vindo"
});

// Exemplo de Produtos (Mock de dados)
// Em um projeto real, estes dados viriam de um banco de dados (MongoDB, PostgreSQL, etc.)
const products = [
    { id: 'prod1', name: 'Paracetamol 500mg', price: 12.50, stock: 100, imageUrl: 'https://via.placeholder.com/150/28a745/ffffff?text=Paracetamol' },
    { id: 'prod2', name: 'Ibuprofeno 400mg', price: 18.00, stock: 50, imageUrl: 'https://via.placeholder.com/150/28a745/ffffff?text=Ibuprofeno' },
    { id: 'prod3', name: 'Vitamina C 1g', price: 35.90, stock: 75, imageUrl: 'https://via.placeholder.com/150/28a745/ffffff?text=Vitamina+C' },
    { id: 'prod4', name: 'Protetor Solar FPS 50', price: 60.00, stock: 30, imageUrl: 'https://via.placeholder.com/150/28a745/ffffff?text=Protetor+Solar' }
];

// Rota para obter todos os produtos
app.get('/api/products', (req, res) => {
    // Envia a lista de produtos como resposta JSON
    res.json(products);
});

// Rota para obter um produto específico por ID
app.get('/api/products/:id', (req, res) => {
    const productId = req.params.id; // Pega o ID da URL
    const product = products.find(p => p.id === productId); // Encontra o produto
    if (product) {
        res.json(product); // Retorna o produto se encontrado
    } else {
        res.status(404).send('Produto não encontrado'); // Erro 404 se não encontrar
    }
});

// Rota para simular um pedido (apenas loga no console por enquanto)
app.post('/api/orders', (req, res) => {
    const order = req.body; // Pega os dados do pedido do corpo da requisição
    console.log('Novo pedido recebido:', order);
    // Em um cenário real, você salvaria este pedido em um banco de dados
    // e processaria o pagamento.
    res.status(201).json({ message: 'Pedido recebido com sucesso!', orderId: Date.now() });
});

// --- Inicia o Servidor ---
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`API de produtos disponível em http://localhost:${PORT}/api/products`);
});