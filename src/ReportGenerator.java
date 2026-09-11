import java.io.FileWriter;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class ReportGenerator {

    public void generateReport(int userId) {

        String sql = """
                SELECT
                    u.name,
                    u.eco_points,
                    COUNT(a.id) AS total_activities,
                    COALESCE(SUM(a.co2_saved), 0) AS total_co2
                FROM users u
                LEFT JOIN activities a
                    ON u.id = a.user_id
                WHERE u.id = ?
                GROUP BY u.id, u.name, u.eco_points
                """;

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1, userId);

            ResultSet rs = ps.executeQuery();

            if (rs.next()) {

                String fileName =
                        "reports\\eco_report_user_" + userId + ".txt";

                FileWriter writer = new FileWriter(fileName);

                writer.write("====================================\n");
                writer.write("          ECO TRACKER REPORT\n");
                writer.write("====================================\n\n");

                writer.write("User Name: "
                        + rs.getString("name") + "\n");

                writer.write("Total Eco Points: "
                        + rs.getInt("eco_points") + "\n");

                writer.write("Total Activities: "
                        + rs.getInt("total_activities") + "\n");

                writer.write("Total CO2 Saved: "
                        + rs.getDouble("total_co2")
                        + " kg\n\n");

                writer.write("====================================\n");
                writer.write("Report generated successfully.\n");
                writer.write("====================================\n");

                writer.close();

                System.out.println(
                        "Report generated successfully!"
                );

                System.out.println(
                        "Saved at: " + fileName
                );
            }

        } catch (Exception e) {
            System.out.println("Failed to generate report.");
            e.printStackTrace();
        }
    }
}