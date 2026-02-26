import { useState, useEffect } from 'react';
import { getComandas, updateComandaStatus, deleteComanda } from '../services/api';

// Mapeamento de status do front-end para o back-end
const statusMap = {
  'Em Preparo': 'preparando',
  'Concluído': 'pronto',
  'Pendente': 'pendente',
  'Cancelado': 'cancelado'
};

// Mapeamento inverso para exibição
const statusDisplayMap = {
  'pendente': 'Pendente',
  'preparando': 'Em Preparo',
  'pronto': 'Concluído',
  'cancelado': 'Cancelado'
};

export function PainelCozinha({ refreshTrigger }) {
  const [comandas, setComandas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Busca as comandas
  useEffect(() => {
    const fetchComandas = async () => {
      setLoading(true);
      try {
        const response = await getComandas();
        console.log('✅ Front-end: Pedidos recebidos!', response.data);
        
        // Extrai a lista de pedidos (pode vir em dados ou direto)
        const listaPedidos = response.data.dados || response.data;
        
        // Formata os pedidos para exibição
        const comandasFormatadas = listaPedidos.map(comanda => ({
          ...comanda,
          statusDisplay: statusDisplayMap[comanda.status] || comanda.status,
          // Garante que itens é um array
          itens: Array.isArray(comanda.itens) ? comanda.itens : []
        }));
        
        setComandas([...comandasFormatadas].reverse());
      } catch (err) {
        console.error('❌ Erro ao buscar pedidos:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComandas();
  }, [refreshTrigger]);

  // Função para lidar com a mudança de status
  const handleMudarStatus = async (id, statusDisplay) => {
    try {
      // Converte o status de exibição para o status do back-end
      const statusBackend = statusMap[statusDisplay];
      
      if (!statusBackend) {
        console.error('Status inválido:', statusDisplay);
        return;
      }
      
      // Chama a API com o status correto
      const response = await updateComandaStatus(id, statusBackend);
      
      // ✅ VERIFICA ONDE ESTÃO OS DADOS NA RESPOSTA
      let comandaAtualizada;
      
      if (response.data.dados) {
        // Se a resposta veio com { sucesso, dados }
        comandaAtualizada = response.data.dados;
      } else if (response.data) {
        // Se a resposta veio direto
        comandaAtualizada = response.data;
      } else {
        console.error('Formato de resposta inválido:', response);
        return;
      }
      
      // Adiciona o statusDisplay para renderização
      comandaAtualizada.statusDisplay = statusDisplayMap[comandaAtualizada.status] || comandaAtualizada.status;
      
      // Garante que itens é um array
      comandaAtualizada.itens = Array.isArray(comandaAtualizada.itens) 
        ? comandaAtualizada.itens 
        : [];
      
      // Atualiza o estado local
      setComandas((comandasAnteriores) =>
        comandasAnteriores.map((comanda) =>
          comanda.id === id ? comandaAtualizada : comanda
        )
      );
      
      console.log(`✅ Status do Pedido #${id} atualizado para ${statusDisplay}`);
    
    } catch (err) {
      console.error('❌ Erro ao atualizar status:', err);
      alert('Falha ao atualizar o status do pedido.');
    }
  };

  // Função para cancelar (deletar) um pedido
  const handleCancelarPedido = async (id) => {
    const confirmacao = window.confirm('Tem certeza que deseja cancelar este pedido?');
    
    if (!confirmacao) return;

    try {
      await deleteComanda(id);
      setComandas((comandasAnteriores) =>
        comandasAnteriores.filter((c) => c.id !== id)
      );
      console.log(`✅ Pedido #${id} cancelado com sucesso!`);
    } catch (err) {
      console.error('❌ Erro ao cancelar pedido:', err);
      alert('Falha ao cancelar o pedido.');
    }
  };

  // Função para remover pedido concluído
  const handleRemoverPedidoConcluido = async (id) => {
    const confirmacao = window.confirm('Deseja remover este pedido concluído do painel?');
    
    if (!confirmacao) return;

    try {
      await deleteComanda(id);
      setComandas((comandasAnteriores) =>
        comandasAnteriores.filter((c) => c.id !== id)
      );
      console.log(`✅ Pedido #${id} removido do painel!`);
    } catch (err) {
      console.error('❌ Erro ao remover pedido:', err);
      alert('Falha ao remover o pedido.');
    }
  };

  // Renderização
  if (loading && comandas.length === 0) {
    return (
      <div className="cozinha-secao">
        <h2>👨‍🍳 Painel da Cozinha</h2>
        <div className="loading-cozinha">Carregando pedidos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cozinha-secao">
        <h2>👨‍🍳 Painel da Cozinha</h2>
        <div className="error-cozinha">
          ❌ Erro ao buscar pedidos. Verifique se o back-end está rodando.
        </div>
      </div>
    );
  }

  return (
    <div className="cozinha-secao">
      <h3>👨‍🍳 Painel da Cozinha</h3>
      <p className="cozinha-info">
        {comandas.length === 0 
          ? 'Nenhum pedido feito ainda.' 
          : `Total de pedidos: ${comandas.length}`
        }
      </p>
      
      {comandas.length > 0 && (
        <div className="cozinha-lista">
          {comandas.map((comanda) => (
            <div key={comanda.id} className="cozinha-pedido">
              
              {/* Botão X para pedidos concluídos */}
              {comanda.status === 'pronto' && (
                <button 
                  className="btn-remover-pedido"
                  onClick={() => handleRemoverPedidoConcluido(comanda.id)}
                  title="Remover pedido concluído"
                >
                  ✕
                </button>
              )}
              
              <h3>Pedido #{comanda.id}</h3>
              <p className="cozinha-mesa">🪑 Mesa: {comanda.mesa}</p>
              <p className="cozinha-status">
                Status: <span className={`status status-${comanda.status}`}>
                  {comanda.statusDisplay}
                </span>
              </p>
              <p className="cozinha-itens">
                📋 Itens: {comanda.itens?.length || 0} {(comanda.itens?.length || 0) === 1 ? 'item' : 'itens'}
              </p>
              <p className="cozinha-total">
                <strong>💰 Total: R$ {comanda.total?.toFixed(2) || '0.00'}</strong>
              </p>
              <p className="cozinha-data">
                <small>🕐 {comanda.dataPedido ? new Date(comanda.dataPedido).toLocaleString('pt-BR') : 'Data não disponível'}</small>
              </p>
              
              <div className="botoes-acao">
                {/* Botões usando os status de exibição */}
                {comanda.status === 'pendente' && (
                  <button 
                    className="btn-em-preparo"
                    onClick={() => handleMudarStatus(comanda.id, 'Em Preparo')}
                  >
                    Marcar "Em Preparo"
                  </button>
                )}
                
                {comanda.status === 'preparando' && (
                  <button 
                    className="btn-concluido"
                    onClick={() => handleMudarStatus(comanda.id, 'Concluído')}
                  >
                    Marcar "Concluído"
                  </button>
                )}
                
                {comanda.status === 'pronto' && (
                  <p className="status-concluido-msg">✅ Pedido Finalizado!</p>
                )}
                
                {comanda.status !== 'pronto' && comanda.status !== 'cancelado' && (
                  <button 
                    className="btn-cancelar"
                    onClick={() => handleCancelarPedido(comanda.id)}
                  >
                    🗑️ Cancelar Pedido
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}