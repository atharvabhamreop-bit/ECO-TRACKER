# ECO-TRACKER
# 🌱 Eco Tracker

Eco Tracker is a web-based application designed to encourage users to adopt environmentally friendly habits by allowing them to record their daily eco-friendly activities, earn Eco Points, track their progress, and compete on a leaderboard.

The project is developed using **React, JavaScript, Java (Spring Boot), and MySQL**.

---

## 🎯 Project Objective

The main objective of Eco Tracker is to encourage sustainable habits by providing users with a simple platform to:

* Register and log in
* Add eco-friendly activities
* Earn Eco Points
* Unlock badges
* Track their environmental progress
* View activity history and reports
* Compare their performance through a leaderboard

---

## 🛠️ Technologies Used

### Frontend

* React.js
* JavaScript
* HTML
* CSS

### Backend

* Java
* Spring Boot
* REST APIs

### Database

* MySQL

---

# 👥 Work Division

The project is divided into three major modules among three team members.

---

## 👤 Member 1 — Login/Register & Dashboard

### Responsibility

Member 1 is responsible for the **user authentication and main dashboard** of the application.

### Main Tasks

* Create the **Registration page**
* Create the **Login page**
* Validate user input
* Connect Login/Register with the Java backend
* Create the main user dashboard
* Display:

  * Total Eco Points
  * Total activities
  * Earned badges
  * Progress
  * Recent activities
* Design the overall frontend layout and navigation
* Integrate dashboard with backend APIs

### Main Components

```text
Login
Register
Navbar
Dashboard
Profile
EcoPointsCard
BadgeCard
ActivitySummary
ProgressCard
```

---

## 👤 Member 2 — Eco Activities & Eco Points

### Responsibility

Member 2 is responsible for the **Eco Activity module and Eco Point calculation**.

### Main Tasks

* Create the **Add Eco Activity** interface
* Define different eco-friendly activities
* Assign Eco Points to activities
* Calculate points earned by the user
* Update the user's total Eco Points
* Define badge criteria
* Assign badges based on achievements
* Send activity and point information to the backend

### Example Activities

| Eco Activity                | Eco Points |
| --------------------------- | ---------: |
| Walking/Cycling             |        +15 |
| Using Public Transport      |        +10 |
| Recycling Waste             |        +10 |
| Avoiding Single-use Plastic |         +5 |
| Saving Electricity          |        +10 |
| Planting a Tree             |        +25 |

*Point values can be modified according to the project's requirements.*

### Example Badge System

```text
🌱 Green Starter
50 Eco Points

🌿 Eco Explorer
100 Eco Points

🌳 Eco Champion
250 Eco Points

🌍 Planet Protector
500 Eco Points
```

---

## 👤 Member 3 — Save Activity, Progress, Reports & Leaderboard

### Responsibility

Member 3 is responsible for **storing activity data, tracking user progress, generating reports, and managing the leaderboard**.

### Main Tasks

* Save user activities in MySQL
* Store activity date and Eco Points
* Store user progress
* Retrieve activity history
* Track daily, weekly, and monthly progress
* Generate progress reports
* Calculate leaderboard rankings
* Provide APIs for the dashboard
* Retrieve data required by the frontend

### 📊 Progress & Reports

Reports can include:

* Total activities
* Total Eco Points
* Daily Eco Points
* Weekly Eco Points
* Monthly Eco Points
* Activities completed
* Badges earned
* Progress over time

### 🏆 Leaderboard

The leaderboard ranks users according to their total Eco Points.

Example:

```text
-----------------------------------------
              LEADERBOARD
-----------------------------------------

Rank       User             Eco Points

🥇 1       User A              520
🥈 2       User B              475
🥉 3       User C              430
   4       User D              390
   5       User E              350
-----------------------------------------
```

---

# 🗄️ Database Structure

The application can use the following main tables.

### Users

```text
user_id
name
email
password
total_points
```

### Activities

```text
activity_id
user_id
activity_name
points
date
```

### Badges

```text
badge_id
badge_name
description
required_points
```

### User_Badges

```text
user_badge_id
user_id
badge_id
date_earned
```

---

# 🔗 Module Integration

The three modules are connected through the **Java Spring Boot backend** and **MySQL database**.

### Member 1

**Login/Register + Dashboard**

### Member 2

**Add Eco Activity + Calculate Eco Points + Assign Badges**

### Member 3

**Save Activity + Track Progress + Reports + Leaderboard**

---

# 🚀 Expected Outcome

Eco Tracker provides an interactive platform that motivates users to develop environmentally friendly habits through **activity tracking, Eco Points, badges, progress reports, and a leaderboard**.

The project demonstrates practical implementation of:

**React + JavaScript + Java Spring Boot + REST APIs + MySQL**

and provides experience in **frontend development, backend development, database management, API integration, and application design**.
