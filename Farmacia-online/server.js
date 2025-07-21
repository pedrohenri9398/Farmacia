const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

const SUPABASE_URL ='https://vovyubntbeesdwibrdlf.supabase.co';
const SUPABASE_ANON_KEY ='uPMfpJM8BYRVYCmSjGTL6I+R8mY0HuP5jE2XZrzfFrXpW+J7RUFQOqEf9UpF7X7Dlk+s6DTrAGvm7+EAiloGXw==';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Bem-vindo à API da Farmácia Online (Supabase)!');
});

app.get('/api/products', async (req, res) => {
    try {
        const { data: products, error } = await supabase
            .from('produtos') 
            .select('*');

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


app.get('/api/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const { data: product, error } = await supabase
            .from('produtos')
            .select('*')
            .eq('id', productId)
            .single();

        if (error && error.code !== 'PGRST116') { 
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

app.post('/api/products', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('produtos')
            .insert([req.body])
            .select();

        if (error) {
            console.error('Erro ao adicionar produto ao Supabase:', error);
            return res.status(400).send('Erro ao adicionar produto. Verifique os dados.');
        }
        res.status(201).json(data[0]);
    } catch (error) {
        console.error('Erro inesperado na rota POST /api/products:', error);
        res.status(500).send('Erro interno do servidor.');
    }
});

app.post('/api/orders', (req, res) => {
    const order = req.body;
    console.log('Novo pedido recebido (via Supabase):', order);
    res.status(201).json({ message: 'Pedido recebido com sucesso!', orderId: Date.now() });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`API de produtos disponível em http://localhost:${PORT}/api/products`);
});