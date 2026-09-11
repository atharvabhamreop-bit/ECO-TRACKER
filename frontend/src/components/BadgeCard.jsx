function BadgeCard({ ecoPoints }) {

  let badge = "🌱 Beginner";

  if (ecoPoints >= 250) {
    badge = "🏆 Green Champion";
  } else if (ecoPoints >= 100) {
    badge = "🌍 Planet Saver";
  } else if (ecoPoints >= 50) {
    badge = "♻️ Eco Warrior";
  }

  return (
    <div className="card">

      <div className="icon">
        🏆
      </div>

      <h3>Badge</h3>

      <strong>
        {badge}
      </strong>

      <p>
        Your current badge
      </p>

    </div>
  );
}

export default BadgeCard;