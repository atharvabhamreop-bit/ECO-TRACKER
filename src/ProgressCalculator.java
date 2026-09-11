import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class ProgressCalculator {

    public void showProgress(int userId) {

        String sql = """
                SELECT
                    SUM(CASE
                        WHEN activity_date = CURDATE()
                        THEN eco_points ELSE 0
                    END) AS daily_points,

                    SUM(CASE
                        WHEN activity_date >= CURDATE() - INTERVAL 6 DAY
                        THEN eco_points ELSE 0
                    END) AS weekly_points,

                    SUM(CASE
                        WHEN MONTH(activity_date) = MONTH(CURDATE())
                        AND YEAR(activity_date) = YEAR(CURDATE())
                        THEN eco_points ELSE 0
                    END) AS monthly_points,

                    SUM(CASE
                        WHEN activity_date = CURDATE()
                        THEN co2_saved ELSE 0
                    END) AS daily_co2,

                    SUM(CASE
                        WHEN activity_date >= CURDATE() - INTERVAL 6 DAY
                        THEN co2_saved ELSE 0
                    END) AS weekly_co2,

                    SUM(CASE
                        WHEN MONTH(activity_date) = MONTH(CURDATE())
                        AND YEAR(activity_date) = YEAR(CURDATE())
                        THEN co2_saved ELSE 0
                    END) AS monthly_co2

                FROM activities
                WHERE user_id = ?
                """;

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1, userId);

            ResultSet rs = ps.executeQuery();

            if (rs.next()) {

                System.out.println("\n===== ECO PROGRESS =====");

                System.out.println(
                    "Today: "
                    + rs.getInt("daily_points")
                    + " points | "
                    + rs.getDouble("daily_co2")
                    + " kg CO2 saved"
                );

                System.out.println(
                    "This Week: "
                    + rs.getInt("weekly_points")
                    + " points | "
                    + rs.getDouble("weekly_co2")
                    + " kg CO2 saved"
                );

                System.out.println(
                    "This Month: "
                    + rs.getInt("monthly_points")
                    + " points | "
                    + rs.getDouble("monthly_co2")
                    + " kg CO2 saved"
                );

                System.out.println("========================");
            }

        } catch (Exception e) {
            System.out.println("Failed to calculate progress.");
            e.printStackTrace();
        }
    }
}
