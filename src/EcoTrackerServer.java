import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class EcoTrackerServer {

    public static void main(String[] args) throws Exception {

        HttpServer server = HttpServer.create(
                new InetSocketAddress(8080), 0
        );

        server.createContext("/", EcoTrackerServer::home);
        server.createContext("/api/history", EcoTrackerServer::history);
        server.createContext("/api/activity", EcoTrackerServer::addActivity);
        server.createContext("/api/dashboard", EcoTrackerServer::dashboard);
        server.createContext("/api/leaderboard", EcoTrackerServer::leaderboard);
        server.createContext("/api/report", EcoTrackerServer::report);

        server.setExecutor(null);
        server.start();

        System.out.println("=================================");
        System.out.println("       ECO TRACKER API SERVER");
        System.out.println("=================================");
        System.out.println("Server running at:");
        System.out.println("http://localhost:8080");
        System.out.println("=================================");
    }


    // ==========================================
    // HOME
    // ==========================================

    private static void home(
            HttpExchange exchange) throws IOException {

        String response = """
                {
                    "message": "Eco Tracker Backend is Working!"
                }
                """;

        sendResponse(exchange, response);
    }


    // ==========================================
    // ACTIVITY HISTORY
    // ==========================================

    private static void history(
            HttpExchange exchange) throws IOException {

        if (exchange.getRequestMethod()
                .equalsIgnoreCase("OPTIONS")) {

            sendCorsResponse(exchange);
            return;
        }

        String sql = """
                SELECT id,
                       activity_name,
                       activity_date,
                       eco_points,
                       co2_saved
                FROM activities
                WHERE user_id = ?
                ORDER BY id DESC
                """;

        StringBuilder json = new StringBuilder();

        json.append("[");

        try (
                Connection con = DBConnection.getConnection();
                PreparedStatement ps = con.prepareStatement(sql)
        ) {

            ps.setInt(1, 1);

            ResultSet rs = ps.executeQuery();

            boolean first = true;

            while (rs.next()) {

                if (!first) {
                    json.append(",");
                }

                json.append("{");

                json.append("\"id\":")
                        .append(rs.getInt("id"))
                        .append(",");

                json.append("\"activityName\":\"")
                        .append(rs.getString("activity_name"))
                        .append("\",");

                json.append("\"activityDate\":\"")
                        .append(rs.getDate("activity_date"))
                        .append("\",");

                json.append("\"ecoPoints\":")
                        .append(rs.getInt("eco_points"))
                        .append(",");

                json.append("\"co2Saved\":")
                        .append(rs.getDouble("co2_saved"));

                json.append("}");

                first = false;
            }

        } catch (Exception e) {

            e.printStackTrace();

            json = new StringBuilder(
                    "{\"error\":\"Failed to load activity history\"}"
            );
        }

        json.append("]");

        sendResponse(
                exchange,
                json.toString()
        );
    }


    // ==========================================
    // ADD ACTIVITY
    // ==========================================

    private static void addActivity(
            HttpExchange exchange) throws IOException {

        if (exchange.getRequestMethod()
                .equalsIgnoreCase("OPTIONS")) {

            sendCorsResponse(exchange);
            return;
        }

        if (!exchange.getRequestMethod()
                .equalsIgnoreCase("POST")) {

            sendResponse(
                    exchange,
                    "{\"error\":\"Only POST method is allowed\"}"
            );

            return;
        }

        InputStream inputStream =
                exchange.getRequestBody();

        String requestBody =
                new String(
                        inputStream.readAllBytes(),
                        StandardCharsets.UTF_8
                );

        System.out.println("\nReceived activity:");
        System.out.println(requestBody);

        try {

            String activityName =
                    getValue(
                            requestBody,
                            "activityName"
                    );

            int ecoPoints =
                    Integer.parseInt(
                            getValue(
                                    requestBody,
                                    "ecoPoints"
                            )
                    );

            double co2Saved =
                    Double.parseDouble(
                            getValue(
                                    requestBody,
                                    "co2Saved"
                            )
                    );

            String insertSql = """
                    INSERT INTO activities
                    (
                        user_id,
                        activity_name,
                        activity_date,
                        eco_points,
                        co2_saved
                    )
                    VALUES (?, ?, CURDATE(), ?, ?)
                    """;

            String updateSql = """
                    UPDATE users
                    SET eco_points = eco_points + ?
                    WHERE id = ?
                    """;

            try (
                    Connection con =
                            DBConnection.getConnection()
            ) {

                try (
                        PreparedStatement ps =
                                con.prepareStatement(insertSql)
                ) {

                    ps.setInt(1, 1);
                    ps.setString(2, activityName);
                    ps.setInt(3, ecoPoints);
                    ps.setDouble(4, co2Saved);

                    ps.executeUpdate();
                }

                try (
                        PreparedStatement ps =
                                con.prepareStatement(updateSql)
                ) {

                    ps.setInt(1, ecoPoints);
                    ps.setInt(2, 1);

                    ps.executeUpdate();
                }
            }

            sendResponse(
                    exchange,
                    """
                    {
                        "message":
                        "Activity added successfully"
                    }
                    """
            );

            System.out.println(
                    "Activity saved successfully!"
            );

        } catch (Exception e) {

            e.printStackTrace();

            sendResponse(
                    exchange,
                    """
                    {
                        "error":
                        "Failed to save activity"
                    }
                    """
            );
        }
    }


    // ==========================================
    // DASHBOARD
    // ==========================================

    private static void dashboard(
            HttpExchange exchange) throws IOException {

        if (exchange.getRequestMethod()
                .equalsIgnoreCase("OPTIONS")) {

            sendCorsResponse(exchange);
            return;
        }

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
                GROUP BY
                    u.id,
                    u.name,
                    u.eco_points
                """;

        try (
                Connection con =
                        DBConnection.getConnection();

                PreparedStatement ps =
                        con.prepareStatement(sql)
        ) {

            ps.setInt(1, 1);

            ResultSet rs =
                    ps.executeQuery();

            if (rs.next()) {

                String name =
                        rs.getString("name");

                int ecoPoints =
                        rs.getInt("eco_points");

                int totalActivities =
                        rs.getInt("total_activities");

                double totalCo2 =
                        rs.getDouble("total_co2");

                String json = """
                        {
                            "name": "%s",
                            "ecoPoints": %d,
                            "totalActivities": %d,
                            "totalCo2": %.2f
                        }
                        """.formatted(
                                name,
                                ecoPoints,
                                totalActivities,
                                totalCo2
                        );

                sendResponse(
                        exchange,
                        json
                );

            } else {

                sendResponse(
                        exchange,
                        """
                        {
                            "error":
                            "User not found"
                        }
                        """
                );
            }

        } catch (Exception e) {

            e.printStackTrace();

            sendResponse(
                    exchange,
                    """
                    {
                        "error":
                        "Failed to load dashboard"
                    }
                    """
            );
        }
    }


    // ==========================================
    // LEADERBOARD
    // ==========================================

    private static void leaderboard(
            HttpExchange exchange) throws IOException {

        if (exchange.getRequestMethod()
                .equalsIgnoreCase("OPTIONS")) {

            sendCorsResponse(exchange);
            return;
        }

        String sql = """
                SELECT
                    id,
                    name,
                    eco_points
                FROM users
                ORDER BY eco_points DESC, id ASC
                """;

        StringBuilder json =
                new StringBuilder();

        json.append("[");

        try (
                Connection con =
                        DBConnection.getConnection();

                PreparedStatement ps =
                        con.prepareStatement(sql);

                ResultSet rs =
                        ps.executeQuery()
        ) {

            boolean first = true;

            int rank = 1;

            while (rs.next()) {

                if (!first) {
                    json.append(",");
                }

                json.append("{");

                json.append("\"rank\":")
                        .append(rank)
                        .append(",");

                json.append("\"id\":")
                        .append(rs.getInt("id"))
                        .append(",");

                json.append("\"name\":\"")
                        .append(rs.getString("name"))
                        .append("\",");

                json.append("\"ecoPoints\":")
                        .append(rs.getInt("eco_points"));

                json.append("}");

                first = false;

                rank++;
            }

        } catch (Exception e) {

            e.printStackTrace();

            json = new StringBuilder(
                    "{\"error\":\"Failed to load leaderboard\"}"
            );
        }

        json.append("]");

        sendResponse(
                exchange,
                json.toString()
        );
    }


    // ==========================================
    // REPORT
    // ==========================================

    private static void report(
            HttpExchange exchange) throws IOException {

        if (exchange.getRequestMethod()
                .equalsIgnoreCase("OPTIONS")) {

            sendCorsResponse(exchange);
            return;
        }

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
                GROUP BY
                    u.id,
                    u.name,
                    u.eco_points
                """;

        try (
                Connection con =
                        DBConnection.getConnection();

                PreparedStatement ps =
                        con.prepareStatement(sql)
        ) {

            ps.setInt(1, 1);

            ResultSet rs =
                    ps.executeQuery();

            if (rs.next()) {

                String name =
                        rs.getString("name");

                int ecoPoints =
                        rs.getInt("eco_points");

                int totalActivities =
                        rs.getInt("total_activities");

                double totalCo2 =
                        rs.getDouble("total_co2");


                String report = """
                        ====================================
                                  ECO TRACKER REPORT
                        ====================================

                        User Name: %s

                        Total Eco Points: %d

                        Total Activities: %d

                        Total CO2 Saved: %.2f kg

                        ====================================
                        Report generated successfully.
                        ====================================
                        """.formatted(
                                name,
                                ecoPoints,
                                totalActivities,
                                totalCo2
                        );


                sendTextResponse(
                        exchange,
                        report
                );

            } else {

                sendResponse(
                        exchange,
                        """
                        {
                            "error":
                            "User not found"
                        }
                        """
                );
            }

        } catch (Exception e) {

            e.printStackTrace();

            sendResponse(
                    exchange,
                    """
                    {
                        "error":
                        "Failed to generate report"
                    }
                    """
            );
        }
    }


    // ==========================================
    // GET VALUE FROM JSON
    // ==========================================

    private static String getValue(
            String json,
            String key) {

        String search =
                "\"" + key + "\":";

        int start =
                json.indexOf(search);

        if (start == -1) {
            return "";
        }

        start += search.length();

        while (
                start < json.length()
                &&
                (
                    json.charAt(start) == ' '
                    ||
                    json.charAt(start) == '"'
                )
        ) {

            start++;
        }

        int end = start;

        while (
                end < json.length()
                &&
                json.charAt(end) != ','
                &&
                json.charAt(end) != '}'
                &&
                json.charAt(end) != '"'
        ) {

            end++;
        }

        return json
                .substring(start, end)
                .trim();
    }


    // ==========================================
    // CORS
    // ==========================================

    private static void sendCorsResponse(
            HttpExchange exchange) throws IOException {

        exchange.getResponseHeaders().set(
                "Access-Control-Allow-Origin",
                "*"
        );

        exchange.getResponseHeaders().set(
                "Access-Control-Allow-Methods",
                "GET, POST, OPTIONS"
        );

        exchange.getResponseHeaders().set(
                "Access-Control-Allow-Headers",
                "Content-Type"
        );

        exchange.sendResponseHeaders(
                204,
                -1
        );

        exchange.close();
    }


    // ==========================================
    // SEND JSON RESPONSE
    // ==========================================

    private static void sendResponse(
            HttpExchange exchange,
            String response) throws IOException {

        exchange.getResponseHeaders().set(
                "Access-Control-Allow-Origin",
                "*"
        );

        exchange.getResponseHeaders().set(
                "Access-Control-Allow-Methods",
                "GET, POST, OPTIONS"
        );

        exchange.getResponseHeaders().set(
                "Access-Control-Allow-Headers",
                "Content-Type"
        );

        exchange.getResponseHeaders().set(
                "Content-Type",
                "application/json"
        );

        byte[] responseBytes =
                response.getBytes(
                        StandardCharsets.UTF_8
                );

        exchange.sendResponseHeaders(
                200,
                responseBytes.length
        );

        try (
                OutputStream output =
                        exchange.getResponseBody()
        ) {

            output.write(responseBytes);
        }
    }


    // ==========================================
    // SEND TEXT RESPONSE
    // ==========================================

    private static void sendTextResponse(
            HttpExchange exchange,
            String response) throws IOException {

        exchange.getResponseHeaders().set(
                "Access-Control-Allow-Origin",
                "*"
        );

        exchange.getResponseHeaders().set(
                "Access-Control-Allow-Methods",
                "GET, POST, OPTIONS"
        );

        exchange.getResponseHeaders().set(
                "Access-Control-Allow-Headers",
                "Content-Type"
        );

        exchange.getResponseHeaders().set(
                "Content-Type",
                "text/plain; charset=UTF-8"
        );

        byte[] responseBytes =
                response.getBytes(
                        StandardCharsets.UTF_8
                );

        exchange.sendResponseHeaders(
                200,
                responseBytes.length
        );

        try (
                OutputStream output =
                        exchange.getResponseBody()
        ) {

            output.write(responseBytes);
        }
    }
}