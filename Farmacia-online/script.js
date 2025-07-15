console.log('Bem vindo a Sua Farmacia Oline!');

document.addEventlistener('DOMContentloaded', () =>  {
  const verprodutosBtn = document.querySelector('#banner-promocional button');
  const secaoProdutos = document.querySelector('#produtos');
  if (verprodutosBtn && secao produtos) {
    verprodutosBtn && addEventListener('click', () => {
      secaoProdutos.scrollIntoView({behavior: 'smooth'});
    });
    
  }
const botoesAdicionarCarrinho = document.queryselectorall('adicionar-carrinho');
  const carrinholink = document.queryselector ('header nav ul li a[href="#carrinho"]');
  let contadorCarrinho = 0;

  if (botoesAdicionarCarrinho.length > 0 && carrinholink) {
    botoesAdicionarcarrinho.forEach(button => {
      button.addEventListener('click', (event) =>  {
        const produtoid = event.target.dataset.id;
        const nomeProduto = event.target.parentnode.queryselector('h3').innerText;
        contadorcarrinho++;
        carrinholink.innertext = 'carrinho (${contadorCarrinho})';
        console.log('Produto "${nomeProduto}" (ID: ${produtoID}) adicionar ao carrinho');
        alert('"${nomeProduto}" adicionar ao carrinho! total: ${contadorCarrinho} itens.');
        
      }
    });
  }
});



const formContato = document.queryselector('#Contato form');
if (formcontato) {
  formcontato.addEventListener('submit', (event) => {
    event.preventDefault();

    const nome = formcontato.queryselector('input[type="text"]').value;
    const email = formcontato.queryselector('inpunt[type="email"]')value;
    const mensagem = formcontato.queryselector('textarea').value 


    if (nome && email && mensagem) {
      console.log('mensagem enviada');
      console.log('nome: ${nome}');
      console.log('email: ${email}');
      console.log('Mensagem: ${mensagem}');
      alert('sua mensagem foi enviada com seucesso! Em breve entraremos em contato ');
      formcontato.reset();
    } else {
      alert('Por favor, preencha todos os campos do fomulario');
      
    }
    }
  })
}