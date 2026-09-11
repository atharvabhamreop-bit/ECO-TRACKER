function ProgressCard({ ecoPoints }) {

  const progress = Math.min(
    Math.round((ecoPoints / 250) * 100),
    100
  );

  return (
    <div className="card">

      <div className="icon">
        📈
      </div>

      <h3>
        Progress
      </h3>

      <strong>
        {progress}%
      </strong>

      <p>
        Overall progress
      </p>

    </div>
  );
}

export default ProgressCard;