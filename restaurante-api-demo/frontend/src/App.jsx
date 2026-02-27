import { useState, useEffect, useMemo } from 'react';
import { getCardapio, createComanda } from './services/api';
import { PainelCozinha } from './components/PainelCozinha';
import { usuarios } from './usuariosMock'; 
import './App.css';

function App() {
  // --- ESTADOS DE AUTENTICAÇÃO ---
  const [logado, setLogado] = useState(false);
  const [isCadastro, setIsCadastro] = useState(false); 
  const [nomeCadastro, setNomeCadastro] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // --- ESTADOS DO SISTEMA ---
  const [cardapio, setCardapio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comanda, setComanda] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [numeromesa, setNumeromesa] = useState(1);
  const [refreshPedidos, setRefreshPedidos] = useState(0);

  // Busca o cardápio ao logar
  useEffect(() => {
    if (!logado) return;

    const fetchCardapio = async () => {
      try {
        const response = await getCardapio();
        setCardapio(response.data.cardapio);
      } catch (err) {
        console.error('Erro ao buscar o cardápio', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCardapio();
  }, [logado]);

  // --- FUNÇÕES DE AUTENTICAÇÃO ---
  const handleLogin = (e) => {
    e.preventDefault();
    const usuarioEncontrado = usuarios.find(
      (u) => u.email === email && u.senha === senha
    );

    if (usuarioEncontrado) {
      setLogado(true);
      setError(null);
    } else {
      alert("E-mail ou senha incorretos!");
    }
  };

  const handleCadastro = (e) => {
    e.preventDefault();
    const usuarioExiste = usuarios.find(u => u.email === email);
    
    if (usuarioExiste) {
      alert("Este e-mail já está cadastrado!");
      return;
    }

    usuarios.push({
      nome: nomeCadastro,
      email: email,
      senha: senha
    });

    alert("Usuário cadastrado com sucesso! Agora faça o login.");
    setIsCadastro(false);
    setSenha('');
    setNomeCadastro('');
  };

  const handleLogout = () => {
    setLogado(false);
    setEmail('');
    setSenha('');
    setComanda([]);
  };

  // --- LÓGICA DO CARDÁPIO ---
  const cardapioFiltrado = useMemo(() => {
    if (!termoBusca.trim()) return cardapio;
    const termoLower = termoBusca.toLowerCase();
    return cardapio.filter(item => 
      item.nome.toLowerCase().includes(termoLower) ||
      item.descricao.toLowerCase().includes(termoLower)
    );
  }, [cardapio, termoBusca]);

  const handleLimparBusca = () => setTermoBusca('');

  const handleAddItemComanda = (item) => {
    setComanda((prev) => {
      const existente = prev.findIndex(ci => ci.id === item.id);
      if (existente !== -1) {
        const nova = [...prev];
        nova[existente].quantidade += 1;
        return nova;
      }
      return [...prev, { ...item, quantidade: 1 }];
    });
  };

  const handleRemoveItemComanda = (index) => {
    setComanda(prev => prev.filter((_, i) => i !== index));
  };

  const handleDiminuirQuantidade = (index) => {
    setComanda(prev => {
      const nova = [...prev];
      if (nova[index].quantidade > 1) {
        nova[index].quantidade -= 1;
        return nova;
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleAumentarQuantidade = (index) => {
    setComanda(prev => {
      const nova = [...prev];
      nova[index].quantidade += 1;
      return nova;
    });
  };

  const calcularTotalComanda = () => comanda.reduce((t, i) => t + (i.preco * i.quantidade), 0);

  const handleFazerPedido = async () => {
    if (comanda.length === 0) return alert('Sua comanda está vazia!');
    const itensIds = comanda.flatMap(item => Array(item.quantidade).fill(item.id));
    
    const dadosPedido = { 
      mesa: `Mesa ${numeromesa}`, 
      itens: itensIds, 
      total: calcularTotalComanda() 
    };

    try {
      const response = await createComanda(dadosPedido);
      alert(`✅ Pedido #${response.data.dados.id} enviado!`);
      setComanda([]);
      setNumeromesa(n => n + 1);
      setRefreshPedidos(prev => prev + 1);
    } catch (err) {
      alert('Erro ao enviar pedido.');
    }
  };

  // --- RENDERS ---

  if (!logado) {
    return (
      <div className="login-container">
        <form className="login-form" onSubmit={isCadastro ? handleCadastro : handleLogin}>
          <h1>{isCadastro ? '📝 Cadastro' : '🍽️ Login Restaurante'}</h1>
          
          {isCadastro && (
            <input 
              type="text" 
              placeholder="Nome Completo" 
              value={nomeCadastro} 
              onChange={(e) => setNomeCadastro(e.target.value)} 
              required 
            />
          )}
          
          <input 
            type="email" 
            placeholder="E-mail" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Senha" 
            value={senha} 
            onChange={(e) => setSenha(e.target.value)} 
            required 
          />
          
          <button type="submit">{isCadastro ? 'Finalizar Cadastro' : 'Entrar'}</button>

          <p className="alternar-auth">
            {isCadastro ? 'Já tem conta?' : 'Não tem conta?'} 
            <span onClick={() => { setIsCadastro(!isCadastro); setSenha(''); }}>
              {isCadastro ? ' Faça Login' : ' Cadastre-se'}
            </span>
          </p>
        </form>
      </div>
    );
  }

  if (loading) return <div className="App"><div className="loading">Carregando cardápio...</div></div>;
  if (error) return <div className="App"><div className="error">Erro ao conectar com o servidor.</div></div>;

  return (
    <div className="App">
      <header className="header-app">
        <h1>🍽️ Cardápio</h1>
        <button className="btn-logout" onClick={handleLogout}>Sair</button>
      </header>
      
      <div className="barra-pesquisa">
        <div className="pesquisa-container">
          <input
            type="text"
            placeholder="Buscar pratos..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            className="input-pesquisa"
          />
          {termoBusca && <button onClick={handleLimparBusca} className="btn-limpar-pesquisa">Limpar</button>}
        </div>
      </div>

      <div className="cardapio-lista">
        {cardapioFiltrado.length === 0 ? (
          <div className="sem-resultados">
            <p>Nenhum prato encontrado.</p>
            <button className="btn-voltar-todos" onClick={handleLimparBusca}>Ver todos</button>
          </div>
        ) : (
          cardapioFiltrado.map((item) => (
            <div key={item.id} className="cardapio-item">
              <h2>{item.nome}</h2>
              <p className="descricao">{item.descricao}</p>
              <p className="preco">R$ {item.preco.toFixed(2)}</p>
              <button onClick={() => handleAddItemComanda(item)} className="btn-adicionar-pedido">
                ➕ Adicionar
              </button>
            </div>
          ))
        )}
      </div>

      <PainelCozinha refreshTrigger={refreshPedidos} />

      <div className="comanda-secao">
        <h2>🛒 Sua Comanda</h2>
        <div className="comanda-lista">
          {comanda.length === 0 ? (
            <p className="comanda-vazia">Carrinho vazio.</p>
          ) : (
            comanda.map((item, index) => (
              <div key={index} className="comanda-item">
                <div className="comanda-item-info">
                  <span className="comanda-item-nome">{item.nome}</span>
                  <span className="comanda-item-preco">
                    R$ {(item.preco * item.quantidade).toFixed(2)}
                    <span className="preco-unitario"> (R$ {item.preco.toFixed(2)} un)</span>
                  </span>
                </div>

                <div className="controle-quantidade-comanda">
                  <button onClick={() => handleDiminuirQuantidade(index)} className="btn-quantidade">-</button>
                  <span className="quantidade-numero">{item.quantidade}</span>
                  <button onClick={() => handleAumentarQuantidade(index)} className="btn-quantidade">+</button>
                </div>

                <button onClick={() => handleRemoveItemComanda(index)} className="btn-remover-item">X</button>
              </div>
            ))
          )}
        </div>
        <hr />
        <div className="comanda-total">
          <strong>Total: R$ {calcularTotalComanda().toFixed(2)}</strong>
        </div>
        <button className="btn-fazer-pedido" onClick={handleFazerPedido} disabled={comanda.length === 0}>
          🍽️ Enviar para Cozinha
        </button>
      </div>
    </div>
  );
}

export default App;