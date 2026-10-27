// Gerado por IA. Colado sem ler. (ATIVIDADE — desafio 3)
//
// Busca um usuário por id numa API e devolve { id, nome, email }.
// A função recebe um `fetchFn` pra facilitar teste (injeção de dependência).

const textoOuVazio = (valor) => (typeof valor === 'string' ? valor : '');

export async function fetchUsuario(id, fetchFn = fetch) {
  if (!Number.isInteger(id) || id <= 0) {
    const recebido = typeof id === 'string' ? `"${id}" (texto, não número)` : String(id);
    throw new Error(`id inválido: ${recebido}. Use um número inteiro maior que zero.`);
  }

  const resposta = await fetchFn(`https://api.exemplo.com/usuarios/${id}`);

  if (!resposta.ok) {
    throw new Error(`Falha ao buscar usuário ${id}: a API respondeu ${resposta.status}.`);
  }

  const dados = await resposta.json().catch(() => {
    throw new Error(`Falha ao buscar usuário ${id}: a API não respondeu com JSON válido.`);
  });

  if (typeof dados !== 'object' || dados === null || Array.isArray(dados)) {
    throw new Error(`Falha ao buscar usuário ${id}: a API respondeu sem os dados do usuário.`);
  }

  return {
    id: dados.id,
    nome: textoOuVazio(dados.nome).trim(),
    email: textoOuVazio(dados.email).trim().toLowerCase(),
  };
}
