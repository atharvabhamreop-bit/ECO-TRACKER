import java.sql.Connection;
import java.sql.PreparedStatement;

public class ActivityRepository {

    public void saveActivity(Activity activity) {

        String insertSql = """
                INSERT INTO activities
                (user_id, activity_name, activity_date,
                 eco_points, co2_saved)
                VALUES (?, ?, ?, ?, ?)
                """;

        String updateSql = """
                UPDATE users
                SET eco_points = eco_points + ?
                WHERE id = ?
                """;

        try (Connection con = DBConnection.getConnection()) {

            // Save activity
            try (PreparedStatement ps =
                    con.prepareStatement(insertSql)) {

                ps.setInt(1, activity.getUserId());
                ps.setString(2, activity.getActivityName());
                ps.setDate(3,
                        java.sql.Date.valueOf(
                                activity.getActivityDate()));
                ps.setInt(4, activity.getEcoPoints());
                ps.setDouble(5, activity.getCo2Saved());

                ps.executeUpdate();
            }

            // Update user's total eco points
            try (PreparedStatement ps =
                    con.prepareStatement(updateSql)) {

                ps.setInt(1, activity.getEcoPoints());
                ps.setInt(2, activity.getUserId());

                ps.executeUpdate();
            }

            System.out.println("Activity saved successfully!");
            System.out.println("Eco points updated!");

        } catch (Exception e) {

            System.out.println("Failed to save activity.");
            e.printStackTrace();
        }
    }
}