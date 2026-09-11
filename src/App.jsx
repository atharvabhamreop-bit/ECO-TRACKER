import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:8080";

const activities = [
  {
    name: "Cycling",
    points: 20,
    co2: 2.5,
  },
  {
    name: "Walking",
    points: 15,
    co2: 1.5,
  },
  {
    name: "Public Transport",
    points: 10,
    co2: 1.0,
  },
  {
    name: "Recycling",
    points: 25,
    co2: 3.0,
  },
  {
    name: "Planting Trees",
    points: 30,
    co2: 5.0,
  },
];

function App() {

  const [page, setPage] =
    useState("Dashboard");

  const [dashboard, setDashboard] =
    useState({
      name: "Atharva",
      ecoPoints: 0,
      totalActivities: 0,
      totalCo2: 0,
    });

  const [history, setHistory] =
    useState([]);

  const [leaderboard, setLeaderboard] =
    useState([]);

  const [selectedActivity, setSelectedActivity] =
    useState(activities[0]);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [reportLoading, setReportLoading] =
    useState(false);


  // ==========================================
  // LOAD DASHBOARD
  // ==========================================

  const loadDashboard = async () => {

    try {

      const response = await fetch(
        `${API}/api/dashboard?refresh=${Date.now()}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load dashboard"
        );
      }

      const data =
        await response.json();

      if (!data.error) {
        setDashboard(data);
      }

    } catch (error) {

      console.error(
        "Dashboard error:",
        error
      );
    }
  };


  // ==========================================
  // LOAD HISTORY
  // ==========================================

  const loadHistory = async () => {

    try {

      const response = await fetch(
        `${API}/api/history?refresh=${Date.now()}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load history"
        );
      }

      const data =
        await response.json();

      if (Array.isArray(data)) {
        setHistory(data);
      }

    } catch (error) {

      console.error(
        "History error:",
        error
      );
    }
  };


  // ==========================================
  // LOAD LEADERBOARD
  // ==========================================

  const loadLeaderboard = async () => {

    try {

      const response = await fetch(
        `${API}/api/leaderboard?refresh=${Date.now()}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load leaderboard"
        );
      }

      const data =
        await response.json();

      if (Array.isArray(data)) {
        setLeaderboard(data);
      }

    } catch (error) {

      console.error(
        "Leaderboard error:",
        error
      );
    }
  };


  // ==========================================
  // INITIAL DATA LOAD
  // ==========================================

  useEffect(() => {

    const loadData = async () => {

      setLoading(true);

      await Promise.all([
        loadDashboard(),
        loadHistory(),
        loadLeaderboard(),
      ]);

      setLoading(false);
    };

    loadData();

  }, []);


  // ==========================================
  // ADD ACTIVITY
  // ==========================================

  const handleAddActivity = async () => {

    setMessage("");

    try {

      const response = await fetch(
        `${API}/api/activity`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            activityName:
              selectedActivity.name,

            ecoPoints:
              selectedActivity.points,

            co2Saved:
              selectedActivity.co2,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to add activity"
        );
      }

      const data =
        await response.json();

      if (data.error) {

        setMessage(
          "Failed to add activity."
        );

        return;
      }

      setMessage(
        `${selectedActivity.name} added successfully!`
      );

      await new Promise(
        (resolve) =>
          setTimeout(resolve, 200)
      );

      await Promise.all([
        loadDashboard(),
        loadHistory(),
        loadLeaderboard(),
      ]);

      setPage("Dashboard");

    } catch (error) {

      console.error(
        "Add activity error:",
        error
      );

      setMessage(
        "Cannot connect to Eco Tracker server."
      );
    }
  };


  // ==========================================
  // GENERATE REPORT
  // ==========================================

  const handleGenerateReport = async () => {

    setReportLoading(true);
    setMessage("");

    try {

      const response = await fetch(
        `${API}/api/report?refresh=${Date.now()}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to generate report"
        );
      }

      const contentType =
        response.headers.get("content-type");

      if (
        contentType &&
        contentType.includes("application/json")
      ) {

        const data =
          await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

      } else {

        const reportText =
          await response.text();

        const blob =
          new Blob(
            [reportText],
            {
              type: "text/plain",
            }
          );

        const url =
          window.URL.createObjectURL(blob);

        const link =
          document.createElement("a");

        link.href = url;

        link.download =
          "eco_tracker_report.txt";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);
      }

      setMessage(
        "Report generated successfully!"
      );

    } catch (error) {

      console.error(
        "Report error:",
        error
      );

      setMessage(
        "Unable to generate report."
      );

    } finally {

      setReportLoading(false);
    }
  };


  // ==========================================
  // DASHBOARD
  // ==========================================

  const Dashboard = () => {

    const recentActivities =
      history.slice(0, 5);

    return (
      <>
        <div className="page-heading">

          <div>

            <h1>
              Dashboard
            </h1>

            <p>
              Track your environmental impact and
              make every action count.
            </p>

          </div>


          <button
            className="primary-button"
            onClick={() => {

              setPage("Add Activity");

              setMessage("");

            }}
          >
            + Add Activity
          </button>

        </div>


        <div className="stats-grid">


          <div className="stat-card green-card">

            <div className="stat-top">

              <span>
                Eco Points
              </span>

              <div className="stat-icon">
                EP
              </div>

            </div>

            <h2>
              {dashboard.ecoPoints}
            </h2>

            <p>
              Total points earned
            </p>

          </div>


          <div className="stat-card blue-card">

            <div className="stat-top">

              <span>
                Activities
              </span>

              <div className="stat-icon">
                AC
              </div>

            </div>

            <h2>
              {dashboard.totalActivities}
            </h2>

            <p>
              Completed activities
            </p>

          </div>


          <div className="stat-card dark-card">

            <div className="stat-top">

              <span>
                CO₂ Saved
              </span>

              <div className="stat-icon">
                CO₂
              </div>

            </div>

            <h2>

              {Number(
                dashboard.totalCo2
              ).toFixed(2)}

              <small>
                {" "}kg
              </small>

            </h2>

            <p>
              Total CO₂ saved
            </p>

          </div>

        </div>


        <div className="dashboard-grid">


          <div className="dashboard-panel">

            <div className="panel-heading">

              <div>

                <h2>
                  Recent Activities
                </h2>

                <p>
                  Your latest eco-friendly actions
                </p>

              </div>


              <button
                className="text-button"
                onClick={() =>
                  setPage("History")
                }
              >
                View All
              </button>

            </div>


            <div className="activity-list">

              {recentActivities.length === 0 ? (

                <div className="empty-state">

                  No activities yet.
                  Add your first eco-friendly activity.

                </div>

              ) : (

                recentActivities.map(
                  (activity, index) => (

                    <div
                      className="activity-item"
                      key={
                        activity.id ??
                        `${activity.activityName}-${activity.activityDate}-${index}`
                      }
                    >

                      <div className="activity-info">

                        <div className="activity-circle">

                          {activity.activityName.charAt(0)}

                        </div>


                        <div>

                          <strong>
                            {activity.activityName}
                          </strong>

                          <span>
                            {activity.activityDate}
                          </span>

                        </div>

                      </div>


                      <div className="activity-points">

                        +{activity.ecoPoints}

                      </div>

                    </div>

                  )
                )

              )}

            </div>

          </div>


          <div className="dashboard-panel impact-panel">

            <h2>
              Your Environmental Impact
            </h2>

            <p>
              Every small action contributes to
              a healthier planet.
            </p>


            <div className="impact-number">

              {Number(
                dashboard.totalCo2
              ).toFixed(2)}

              <span>
                {" "}kg
              </span>

            </div>


            <div className="impact-label">
              CO₂ emissions saved
            </div>


            <div className="impact-line">

              <span>
                Eco activities
              </span>

              <strong>
                {dashboard.totalActivities}
              </strong>

            </div>


            <div className="impact-line">

              <span>
                Eco points
              </span>

              <strong>
                {dashboard.ecoPoints}
              </strong>

            </div>

          </div>

        </div>
      </>
    );
  };


  // ==========================================
  // ADD ACTIVITY
  // ==========================================

  const AddActivity = () => {

    return (
      <>
        <div className="page-heading">

          <div>

            <h1>
              Add Activity
            </h1>

            <p>
              Record an eco-friendly action
              and increase your environmental impact.
            </p>

          </div>

        </div>


        <div className="form-panel">

          <div className="form-group">

            <label>
              Select Activity
            </label>


            <select
              value={selectedActivity.name}

              onChange={(event) => {

                const activity =
                  activities.find(
                    (item) =>
                      item.name ===
                      event.target.value
                  );

                setSelectedActivity(
                  activity
                );

                setMessage("");

              }}
            >

              {activities.map(
                (activity) => (

                  <option
                    key={activity.name}
                    value={activity.name}
                  >
                    {activity.name}
                  </option>

                )
              )}

            </select>

          </div>


          <div className="activity-preview">

            <div>

              <span>
                Eco Points
              </span>

              <strong>
                +{selectedActivity.points}
              </strong>

            </div>


            <div>

              <span>
                CO₂ Saved
              </span>

              <strong>
                {selectedActivity.co2} kg
              </strong>

            </div>

          </div>


          <button
            className="primary-button"
            onClick={handleAddActivity}
          >
            Add Activity
          </button>


          {message && (

            <div className="form-message">
              {message}
            </div>

          )}

        </div>
      </>
    );
  };


  // ==========================================
  // HISTORY
  // ==========================================

  const History = () => {

    return (
      <>
        <div className="page-heading">

          <div>

            <h1>
              Activity History
            </h1>

            <p>
              View all your recorded
              environmental activities.
            </p>

          </div>

        </div>


        <div className="dashboard-panel">

          {history.length === 0 ? (

            <div className="empty-state">
              No activities recorded yet.
            </div>

          ) : (

            <div className="history-table">

              <div className="history-header">

                <span>
                  Activity
                </span>

                <span>
                  Date
                </span>

                <span>
                  Eco Points
                </span>

                <span>
                  CO₂ Saved
                </span>

              </div>


              {history.map(
                (activity, index) => (

                  <div
                    className="history-row"
                    key={
                      activity.id ??
                      `${activity.activityName}-${activity.activityDate}-${index}`
                    }
                  >

                    <strong>
                      {activity.activityName}
                    </strong>

                    <span>
                      {activity.activityDate}
                    </span>

                    <span className="points">
                      +{activity.ecoPoints}
                    </span>

                    <span>
                      {activity.co2Saved} kg
                    </span>

                  </div>

                )
              )}

            </div>

          )}

        </div>
      </>
    );
  };


  // ==========================================
  // PROGRESS
  // ==========================================

  const Progress = () => {

    const today =
      new Date()
        .toISOString()
        .split("T")[0];


    const todayActivities =
      history.filter(
        (activity) =>
          activity.activityDate === today
      );


    const todayPoints =
      todayActivities.reduce(
        (sum, activity) =>
          sum +
          Number(activity.ecoPoints),
        0
      );


    const todayCo2 =
      todayActivities.reduce(
        (sum, activity) =>
          sum +
          Number(activity.co2Saved),
        0
      );


    return (
      <>
        <div className="page-heading">

          <div>

            <h1>
              Progress
            </h1>

            <p>
              Track your environmental progress.
            </p>

          </div>

        </div>


        <div className="stats-grid">

          <div className="stat-card green-card">

            <span>
              Today's Eco Points
            </span>

            <h2>
              {todayPoints}
            </h2>

            <p>
              Points earned today
            </p>

          </div>


          <div className="stat-card blue-card">

            <span>
              Today's Activities
            </span>

            <h2>
              {todayActivities.length}
            </h2>

            <p>
              Activities completed today
            </p>

          </div>


          <div className="stat-card dark-card">

            <span>
              Today's CO₂ Saved
            </span>

            <h2>

              {todayCo2.toFixed(2)}

              <small>
                {" "}kg
              </small>

            </h2>

            <p>
              Carbon emissions reduced
            </p>

          </div>

        </div>


        <div className="dashboard-panel">

          <h2>
            Overall Progress
          </h2>

          <p>

            You have completed{" "}

            <strong>
              {dashboard.totalActivities}
            </strong>{" "}

            eco-friendly activities and earned{" "}

            <strong>
              {dashboard.ecoPoints}
            </strong>{" "}

            Eco Points.

          </p>

        </div>

      </>
    );
  };


  // ==========================================
  // LEADERBOARD
  // ==========================================

  const Leaderboard = () => {

    return (
      <>
        <div className="page-heading">

          <div>

            <h1>
              Leaderboard
            </h1>

            <p>
              See how you are performing.
            </p>

          </div>

        </div>


        <div className="dashboard-panel">

          {leaderboard.length === 0 ? (

            <div className="empty-state">
              No users found.
            </div>

          ) : (

            <div className="leaderboard-list">

              {leaderboard.map(
                (user) => (

                  <div
                    className="leaderboard-row"
                    key={user.id}
                  >

                    <div className="rank">

                      {user.rank}

                    </div>


                    <div className="leaderboard-user">

                      <div className="user-avatar">

                        {user.name
                          .charAt(0)
                          .toUpperCase()}

                      </div>


                      <strong>
                        {user.name}
                      </strong>

                    </div>


                    <span className="leaderboard-points">

                      {user.ecoPoints}

                      {" "}points

                    </span>

                  </div>
                )
              )}

            </div>

          )}

        </div>
      </>
    );
  };


  // ==========================================
  // REPORTS
  // ==========================================

  const Reports = () => {

    return (
      <>
        <div className="page-heading">

          <div>

            <h1>
              Reports
            </h1>

            <p>
              View and download a summary of your
              environmental contribution.
            </p>

          </div>

        </div>


        <div className="report-card">

          <h2>
            Eco Tracker Report
          </h2>


          <p>

            User Name:{" "}

            <strong>
              {dashboard.name}
            </strong>

          </p>


          <p>

            Total Eco Points:{" "}

            <strong>
              {dashboard.ecoPoints}
            </strong>

          </p>


          <p>

            Total Activities:{" "}

            <strong>
              {dashboard.totalActivities}
            </strong>

          </p>


          <p>

            Total CO₂ Saved:{" "}

            <strong>

              {Number(
                dashboard.totalCo2
              ).toFixed(2)}

              {" "}kg

            </strong>

          </p>


          <button
            className="primary-button"
            onClick={handleGenerateReport}
            disabled={reportLoading}
          >

            {reportLoading
              ? "Generating Report..."
              : "Generate & Download Report"}

          </button>


          {message && (

            <div className="form-message">
              {message}
            </div>

          )}

        </div>
      </>
    );
  };


  // ==========================================
  // PAGE ROUTER
  // ==========================================

  const renderPage = () => {

    if (loading) {

      return (
        <div className="loading">
          Loading Eco Tracker...
        </div>
      );

    }


    switch (page) {

      case "Dashboard":
        return <Dashboard />;

      case "Add Activity":
        return <AddActivity />;

      case "History":
        return <History />;

      case "Progress":
        return <Progress />;

      case "Leaderboard":
        return <Leaderboard />;

      case "Reports":
        return <Reports />;

      default:
        return <Dashboard />;
    }
  };


  // ==========================================
  // APP
  // ==========================================

  return (

    <div className="app">

      <aside className="sidebar">

        <div className="logo">

          <span>
            O
          </span>

          &nbsp; TRACKER

        </div>


        <div className="sidebar-menu">

          <p className="menu-title">
            MAIN MENU
          </p>


          {[
            "Dashboard",
            "Add Activity",
            "History",
            "Progress",
            "Leaderboard",
            "Reports",
          ].map(
            (item) => (

              <button
                key={item}

                className={
                  page === item
                    ? "nav-button active"
                    : "nav-button"
                }

                onClick={() => {

                  setPage(item);

                  setMessage("");

                }}
              >

                {item}

              </button>

            )
          )}

        </div>


        <div className="sidebar-footer">

          <div className="user-mini">

            <div className="user-avatar">
              A
            </div>


            <div>

              <strong>
                {dashboard.name}
              </strong>

              <span>
                Eco Member
              </span>

            </div>

          </div>

        </div>

      </aside>


      <main className="main-content">

        {renderPage()}

      </main>

    </div>
  );
}

export default App;