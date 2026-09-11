import java.time.LocalDate;
import java.util.Scanner;

public class Main {

    public static void main(String[] args) {

        Scanner scanner = new Scanner(System.in);

        ActivityRepository repository = new ActivityRepository();
        ActivityHistory history = new ActivityHistory();
        ProgressCalculator progress = new ProgressCalculator();
        Leaderboard leaderboard = new Leaderboard();
        ReportGenerator report = new ReportGenerator();

        int userId = 1;

        while (true) {

            System.out.println("\n===== ECO TRACKER =====");
            System.out.println("1. Add Activity");
            System.out.println("2. View Activity History");
            System.out.println("3. View Progress");
            System.out.println("4. View Leaderboard");
            System.out.println("5. Generate Report");
            System.out.println("6. Exit");
            System.out.print("Enter your choice: ");

            int choice = scanner.nextInt();

            switch (choice) {

                case 1:

                    System.out.println("\n--- Select Activity ---");
                    System.out.println("1. Cycling");
                    System.out.println("2. Walking");
                    System.out.println("3. Public Transport");
                    System.out.println("4. Recycling");
                    System.out.println("5. Planting Trees");
                    System.out.print("Enter activity: ");

                    int activityChoice = scanner.nextInt();

                    String activityName;
                    int ecoPoints;
                    double co2Saved;

                    switch (activityChoice) {

                        case 1:
                            activityName = "Cycling";
                            ecoPoints = 20;
                            co2Saved = 2.5;
                            break;

                        case 2:
                            activityName = "Walking";
                            ecoPoints = 15;
                            co2Saved = 1.5;
                            break;

                        case 3:
                            activityName = "Public Transport";
                            ecoPoints = 10;
                            co2Saved = 1.0;
                            break;

                        case 4:
                            activityName = "Recycling";
                            ecoPoints = 25;
                            co2Saved = 3.0;
                            break;

                        case 5:
                            activityName = "Planting Trees";
                            ecoPoints = 30;
                            co2Saved = 5.0;
                            break;

                        default:
                            System.out.println("Invalid activity choice.");
                            continue;
                    }

                    Activity activity = new Activity(
                            userId,
                            activityName,
                            LocalDate.now(),
                            ecoPoints,
                            co2Saved
                    );

                    repository.saveActivity(activity);

                    break;

                case 2:
                    history.showHistory(userId);
                    break;

                case 3:
                    progress.showProgress(userId);
                    break;

                case 4:
                    leaderboard.showLeaderboard();
                    break;

                case 5:
                    report.generateReport(userId);
                    break;

                case 6:
                    System.out.println("Thank you for using Eco Tracker!");
                    scanner.close();
                    return;

                default:
                    System.out.println("Invalid choice. Try again.");
            }
        }
    }
}