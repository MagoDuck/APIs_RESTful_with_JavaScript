// Simulação de Banco de Dados em Memória
// Este arquivo funciona como nossa "cozinha" onde guardamos os dados

// Array que representa o cardápio do restaurante
const cardapio = [
  { id: 1, nome: 'Prato Feito', preco: 13.00, descricao: 'Arroz, feijão, bife e salada'},
  { id: 2, nome: 'Suco de Laranja', preco: 8.00, descricao: 'Suco natural 500ml' },
  { id: 3, nome: 'Hambúrguer Artesanal', preco: 35.00, descricao: 'Pão, carne 180g, queijo e batata frita' },
  { id: 4, nome: 'Pizza Margherita', preco: 40.00, descricao: 'Pizza tradicional italiana' },
  { id: 5, nome: 'Guaraná', preco: 7.00, descricao: 'Lata 350ml' },
  { id: 6, nome: 'Doce de leite', preco: 9.00, descricao: "Uma pitada de açucar pra alegrar seu dia" },
  { id: 7, nome: 'Macarronada', preco: 35.00, descricao: 'Massa original de macarronada' },
  { id: 8, nome: 'Strogonoff', preco: 40.00, descricao: 'Uma boa porção de Strogonoff' },
  { id: 9, nome: 'Pepsi', preco: 12.00, descricao: 'Lata 350ml' },
  { id: 10, nome: 'Coca-Cola', preco: 30.00, descricao: "Lata 350ml" },
  { id: 11, nome: 'Coxinha', preco: 15.00, descricao: 'Coxinha de frango' },
  { id: 12, nome: 'Suco de Acerola', preco: 8.00, descricao: 'Suco natural 500ml' },
  { id: 13, nome: 'Cachorro-quente', preco: 35.00, descricao: 'Pão, salsicha, purê de batata, batata palha, molho de carne' },
  { id: 14, nome: 'Pizza de calabresa', preco: 40.00, descricao: 'Pizza com calabresa' },
  { id: 15, nome: 'Fanta', preco: 7.00, descricao: 'Lata 350ml' },
  { id: 16, nome: 'Brigadeiro', preco: 9.00, descricao: "Feito com chocolate de primeira" },
  { id: 17, nome: 'Feijoada', preco: 120.00, descricao: 'Feijão preto, carne, porção de arroz, vinagrete, orelha de porco' },
  { id: 18, nome: 'Salada de salmão', preco: 40.00, descricao: 'Tem salmão' },
  { id: 19, nome: 'Guaraná Jesus', preco: 12.00, descricao: 'Lata 350ml, beba e seja abençoado' },
  { id: 20, nome: 'Macarrão com Queijo', preco: 30.00, descricao: "Divertida" }
];

// Exportamos os arrays e a função de reset para serem usados em outros arquivos
module.exports = {
  cardapio
};
