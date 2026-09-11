function EcoPointsCard({ ecoPoints }) {
  return (
    <div className="card">
      <div className="icon">🌿</div>

      <h3>Eco Points</h3>

      <strong>{ecoPoints}</strong>

      <p>Points earned</p>
    </div>
  );
}

export default EcoPointsCard;