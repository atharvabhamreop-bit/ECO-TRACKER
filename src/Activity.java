import java.time.LocalDate;

public class Activity {

    private int userId;
    private String activityName;
    private LocalDate activityDate;
    private int ecoPoints;
    private double co2Saved;

    public Activity(int userId, String activityName,
                    LocalDate activityDate,
                    int ecoPoints, double co2Saved) {

        this.userId = userId;
        this.activityName = activityName;
        this.activityDate = activityDate;
        this.ecoPoints = ecoPoints;
        this.co2Saved = co2Saved;
    }

    public int getUserId() {
        return userId;
    }

    public String getActivityName() {
        return activityName;
    }

    public LocalDate getActivityDate() {
        return activityDate;
    }

    public int getEcoPoints() {
        return ecoPoints;
    }

    public double getCo2Saved() {
        return co2Saved;
    }
}