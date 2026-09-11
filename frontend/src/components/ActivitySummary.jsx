function ActivitySummary({ completedActivities }) {
  return (
    <div className="card">

      <div className="icon">
        ♻️
      </div>

      <h3>
        Activities
      </h3>

      <strong>
        {completedActivities.length}
      </strong>

      <p>
        Activities completed
      </p>

    </div>
  );
}

export default ActivitySummary;