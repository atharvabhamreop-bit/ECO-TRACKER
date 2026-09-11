import "./Dashboard.css";
import Navbar from "../components/Navbar";

import EcoPointsCard from "../components/EcoPointsCard";
import BadgeCard from "../components/BadgeCard";
import ActivitySummary from "../components/ActivitySummary";
import ProgressCard from "../components/ProgressCard";

function Dashboard({
  ecoPoints,
  completedActivities,
}) {

  const badges = [
    {
      icon: "🌱",
      name: "Beginner",
      points: 10,
      unlocked: ecoPoints >= 10,
    },
    {
      icon: "♻️",
      name: "Eco Warrior",
      points: 50,
      unlocked: ecoPoints >= 50,
    },
    {
      icon: "🌍",
      name: "Planet Saver",
      points: 100,
      unlocked: ecoPoints >= 100,
    },
    {
      icon: "🏆",
      name: "Green Champion",
      points: 250,
      unlocked: ecoPoints >= 250,
    },
  ];

  const progress = Math.min(
    Math.round((ecoPoints / 250) * 100),
    100
  );

  return (
    <div className="dashboard">

      <Navbar />

      {/* HEADER */}

      <header className="dashboard-header">

        <div>
          <h1>🌱 ECO-TRACKER</h1>

          <p>
            Track your eco-friendly journey
          </p>
        </div>

        <button
          className="profile-btn"
          onClick={() =>
            window.location.href = "/profile"
          }
        >
          Profile
        </button>

      </header>


      {/* MAIN */}

      <main>

        <h2>
          Welcome back! 👋
        </h2>

        <p className="subtitle">
          Keep making small changes for a greener planet.
        </p>


        {/* COMPONENT CARDS */}

        <div className="cards">

          <EcoPointsCard
            ecoPoints={ecoPoints}
          />

          <BadgeCard
            ecoPoints={ecoPoints}
          />

          <ActivitySummary
            completedActivities={
              completedActivities
            }
          />

          <ProgressCard
            ecoPoints={ecoPoints}
          />

        </div>


        {/* BADGES SECTION */}

        <section className="badges-section">

          <h2>
            Your Badges 🏆
          </h2>

          <div className="badges-grid">

            {badges.map((badge) => (

              <div
                className={`badge ${
                  badge.unlocked
                    ? "unlocked"
                    : "locked"
                }`}
                key={badge.name}
              >

                <div className="badge-icon">
                  {badge.icon}
                </div>

                <h3>
                  {badge.name}
                </h3>

                <p>
                  Earn {badge.points} Eco Points
                </p>

                <span>
                  {badge.unlocked
                    ? "✓ Unlocked"
                    : "🔒 Locked"}
                </span>

              </div>

            ))}

          </div>

        </section>


        {/* PROGRESS SECTION */}

        <section className="progress-section">

          <h2>
            Your Eco Progress 📈
          </h2>

          <div className="progress-container">

            <div className="progress-bar">

              <div
                className="progress-fill"
                style={{
                  width: `${progress}%`,
                }}
              ></div>

            </div>

            <p>
              {ecoPoints} / 250 Eco Points
            </p>

          </div>

        </section>


        {/* RECENT ACTIVITY */}

        <section className="activity">

          <h2>
            Recent Activity
          </h2>

          <div className="empty-activity">

            <span>
              🌍
            </span>

            {completedActivities.length === 0 ? (

              <>
                <h3>
                  No activities yet
                </h3>

                <p>
                  Start completing eco-friendly
                  activities to see your progress here.
                </p>
              </>

            ) : (

              <>
                <h3>
                  Great job! 🌱
                </h3>

                <p>
                  You have completed{" "}
                  <strong>
                    {completedActivities.length}
                  </strong>{" "}
                  eco-friendly activities.
                </p>

                <p>
                  You have earned{" "}
                  <strong>
                    {ecoPoints}
                  </strong>{" "}
                  Eco Points.
                </p>
              </>

            )}

            <button
              onClick={() =>
                window.location.href = "/activities"
              }
            >
              Start Activity
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;