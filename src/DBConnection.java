import java.sql.Connection;
import java.sql.DriverManager;

public class DBConnection {

    private static final String URL =
            "jdbc:mysql://localhost:3306/eco_tracker";

    private static final String USER = "root";

    private static final String PASSWORD =
            "YOUR_PASSWORD_HERE"; // Replace with your actual password

    public static Connection getConnection() throws Exception {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}javac -cp "lib\mysql-connector-j-26.7.0.jar" -d src src\Main.java src\DBConnection.java