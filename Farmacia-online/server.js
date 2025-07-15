const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js'); // Importa o cliente Supabase

const app = express();
const PORT = process.env.PORT || 3000;

// --- Configuração do Supabase ---
// SUBSTITUA PELAS SUAS CHAVES DO SUPABASE
const SUPABASE_URL = 'https://vovyubntbeesdwibrdlf.supabase.co'; // Ex: https://your-project-ref.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvdnl1Ym50YmVlc2R3aWJyZGxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1OTk5ODcsImV4cCI6MjA2ODE3NTk4N30.j0l9wfwuTaX9bOFq8G3dXd1_y3MqYUjQfzZlouavn9s'; // Ex: eyJhbGciOiJIUzI1Ni...

// Inicializa o cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Rotas ---

app.get('/', (req, res) => {
    res.send('Bem-vindo à API da Farmácia Online (Supabase)!');
});

// Rota para obter todos os produtos do Supabase
app.get('/api/products', async (req, res) => {
    try {
        // Usa o cliente Supabase para selecionar todos os produtos da tabela 'products'
        const { data: products, error } = await supabase
            .from('products') // Nome da sua tabela
            .select('*'); // Seleciona todas as colunas

        if (error) {
            console.error('Erro ao buscar produtos do Supabase:', error);
            return res.status(500).send('Erro interno do servidor ao buscar produtos.');
        }
        res.json(products);
    } catch (error) {
        console.error('Erro inesperado na rota /api/products:', error);
        res.status(500).send('Erro interno do servidor.');
    }
});

// Rota para obter um produto específico por ID do Supabase
app.get('/api/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        // Supabase usa 'eq' para igualdade e assume a Primary Key (id)
        const { data: product, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId) // Busca pelo ID
            .single(); // Espera apenas um resultado

        if (error && error.code !== 'PGRST116') { // PGRST116 é "no rows found"
            console.error('Erro ao buscar produto por ID no Supabase:', error);
            return res.status(500).send('Erro interno do servidor ao buscar produto por ID.');
        }

        if (product) {
            res.json(product);
        } else {
            res.status(404).send('Produto não encontrado');
        }
    } catch (error) {
        console.error('Erro inesperado na rota /api/products/:id:', error);
        res.status(500).send('Erro interno do servidor.');
    }
});

// Rota para adicionar um novo produto ao Supabase
app.post('/api/products', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .insert([req.body]) // Insere o objeto do corpo da requisição
            .select(); // Retorna o item inserido

        if (error) {
            console.error('Erro ao adicionar produto ao Supabase:', error);
            return res.status(400).send('Erro ao adicionar produto. Verifique os dados.');
        }
        res.status(201).json(data[0]); // Retorna o primeiro (e único) item inserido
    } catch (error) {
        console.error('Erro inesperado na rota POST /api/products:', error);
        res.status(500).send('Erro interno do servidor.');
    }
});

// Rota para simular um pedido (mantida, mas futuramente usaria uma tabela 'orders' no Supabase)
app.post('/api/orders', (req, res) => {
    const order = req.body;
    console.log('Novo pedido recebido (via Supabase):', order);
    res.status(201).json({ message: 'Pedido recebido com sucesso!', orderId: Date.now() });
});

// --- Inicia o Servidor ---
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`API de produtos disponível em http://localhost:${PORT}/api/products`);
});