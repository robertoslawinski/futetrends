export default function Legal({ type }) {
  const privacy = type === "privacy";
  return (
    <div className="page prose">
      <h1>{privacy ? "Política de Privacidade" : "Termos de Uso"}</h1>
      {privacy ? (
        <p>O FuteTrends armazena dados de conta, histórico de palpites e estatísticas de ranking para operar o jogo. Antes do lançamento público, configure os avisos finais de banco de dados, analytics e hospedagem.</p>
      ) : (
        <p>FuteTrends é um jogo gratuito de entretenimento e inteligência esportiva. Não oferece apostas em dinheiro real, depósitos, saques, odds ou prêmios financeiros.</p>
      )}
    </div>
  );
}
