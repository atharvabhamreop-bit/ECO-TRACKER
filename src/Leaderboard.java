import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class Leaderboard {

    public void showLeaderboard() {

        String sql = """
                SELECT name, eco_points
                FROM users
                ORDER BY eco_points DESC
                """;

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            System.out.println("\n===== ECO LEADERBOARD =====");

            int rank = 1;

            while (rs.next()) {

                System.out.println(
                    rank + ". "
                    + rs.getString("name")
                    + " - "
                    + rs.getInt("eco_points")
                    + " points"
                );

                rank++;
            }

            System.out.println("===========================");

        } catch (Exception e) {
            System.out.println("Failed to load leaderboard.");
            e.printStackTrace();
        }
    }
}
