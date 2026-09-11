import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class ActivityHistory {

    public void showHistory(int userId) {

        String sql = """
                SELECT activity_name, activity_date,
                       eco_points, co2_saved
                FROM activities
                WHERE user_id = ?
                ORDER BY activity_date DESC
                """;

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1, userId);

            ResultSet rs = ps.executeQuery();

            System.out.println("\n===== ACTIVITY HISTORY =====");

            while (rs.next()) {

                System.out.println(
                    rs.getString("activity_name")
                    + " | "
                    + rs.getDate("activity_date")
                    + " | "
                    + rs.getInt("eco_points")
                    + " points | "
                    + rs.getDouble("co2_saved")
                    + " kg CO2 saved"
                );
            }

            System.out.println("============================");

        } catch (Exception e) {
            System.out.println("Failed to load activity history.");
            e.printStackTrace();
        }
    }
}
