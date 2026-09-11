import Navbar from "../components/Navbar";
import "./Activities.css";

function Activities({
  ecoPoints,
  setEcoPoints,
  completedActivities,
  setCompletedActivities,
}) {

  const activities = [
    {
      id: 1,
      icon: "🚲",
      title: "Cycling",
      description:
        "Use a bicycle instead of a vehicle.",
      points: 20,
    },

    {
      id: 2,
      icon: "🌳",
      title: "Plant a Tree",
      description:
        "Plant and take care of a tree.",
      points: 50,
    },

    {
      id: 3,
      icon: "♻️",
      title: "Recycle Waste",
      description:
        "Separate and recycle household waste.",
      points: 30,
    },

    {
      id: 4,
      icon: "💧",
      title: "Save Water",
      description:
        "Avoid wasting water during daily activities.",
      points: 15,
    },

    {
      id: 5,
      icon: "💡",
      title: "Save Electricity",
      description:
        "Switch off lights and appliances when not needed.",
      points: 10,
    },
  ];


  function completeActivity(activity) {

    if (
      !completedActivities.includes(activity.id)
    ) {

      setCompletedActivities([
        ...completedActivities,
        activity.id,
      ]);

      setEcoPoints(
        ecoPoints + activity.points
      );

    }

  }


  return (

    <div className="activities-page">

      <Navbar />


      <div className="activities-container">


        {/* HEADER */}

        <div className="activities-header">

          <div>

            <h1>
              Eco Activities 🌱
            </h1>

            <p>
              Complete activities and earn Eco Points.
            </p>

          </div>


          {/* POINTS */}

          <div className="points-box">

            <span>
              🌿
            </span>

            <strong>
              {ecoPoints}
            </strong>

            <small>
              Eco Points
            </small>

          </div>

        </div>


        {/* ACTIVITY CARDS */}

        <div className="activity-grid">

          {activities.map((activity) => {

            const isCompleted =
              completedActivities.includes(
                activity.id
              );

            return (

              <div
                className={`activity-card ${
                  isCompleted
                    ? "completed"
                    : ""
                }`}
                key={activity.id}
              >

                <div className="activity-icon">
                  {activity.icon}
                </div>

                <h2>
                  {activity.title}
                </h2>

                <p>
                  {activity.description}
                </p>


                <div className="activity-bottom">

                  <span>
                    +{activity.points} Points
                  </span>


                  <button
                    onClick={() =>
                      completeActivity(activity)
                    }
                    disabled={isCompleted}
                  >

                    {isCompleted
                      ? "✓ Completed"
                      : "Complete"}

                  </button>

                </div>

              </div>

            );

          })}

        </div>

      </div>

    </div>

  );
}

export default Activities;