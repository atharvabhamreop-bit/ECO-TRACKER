package com.eco;

import java.time.LocalDate;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController @RequestMapping("/api") @CrossOrigin
public class ApiController {
    // Edit points, CO2 (kg) and badge thresholds here
    static final Map<String, Integer> POINTS = new LinkedHashMap<>();
    static final Map<String, Double> CO2 = new LinkedHashMap<>();
    static final Map<String, Integer> BADGES = new LinkedHashMap<>();
    static {
        POINTS.put("Walking/Cycling", 15);
        POINTS.put("Using Public Transport", 10);
        POINTS.put("Recycling Waste", 10);
        POINTS.put("Avoiding Single-use Plastic", 5);
        POINTS.put("Saving Electricity", 10);
        POINTS.put("Planting a Tree", 25);

        // Placeholder estimates in kg CO2 - replace with cited values (DEFRA / EPA / CEA India)
        CO2.put("Walking/Cycling", 2.6);
        CO2.put("Using Public Transport", 1.5);
        CO2.put("Recycling Waste", 1.0);
        CO2.put("Avoiding Single-use Plastic", 0.1);
        CO2.put("Saving Electricity", 0.8);
        CO2.put("Planting a Tree", 21.0);

        BADGES.put("Green Starter", 50);
        BADGES.put("Eco Explorer", 100);
        BADGES.put("Eco Champion", 250);
        BADGES.put("Planet Protector", 500);
    }

    private final UserRepo users;
    private final ActivityRepo acts;
    private final BCryptPasswordEncoder enc = new BCryptPasswordEncoder();

    ApiController(UserRepo users, ActivityRepo acts) { this.users = users; this.acts = acts; }

    @PostMapping("/register")
    User register(@RequestBody User u) {
        if (users.findByEmail(u.email).isPresent())
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        u.password = enc.encode(u.password);
        u.totalPoints = 0;
        u.totalCo2Saved = 0;
        return users.save(u);
    }

    @PostMapping("/login")
    User login(@RequestBody User u) {
        return users.findByEmail(u.email).filter(x -> enc.matches(u.password, x.password))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Wrong email or password"));
    }

    @GetMapping("/config")
    Map<String, Object> config() {
        return Map.of("activities", POINTS, "co2", CO2, "badges", BADGES);
    }

    @PostMapping("/activities")
    Activity add(@RequestBody Activity a) {
        Integer p = POINTS.get(a.activityName);
        if (p == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown activity");
        User u = users.findById(a.userId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No such user"));
        a.points = p;
        a.co2Saved = CO2.get(a.activityName);
        a.date = LocalDate.now();
        u.totalPoints += p;
        u.totalCo2Saved += a.co2Saved;
        users.save(u);
        return acts.save(a);
    }

    @GetMapping("/users/{id}/dashboard")
    Map<String, Object> dashboard(@PathVariable Long id) {
        User u = users.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No such user"));
        List<Activity> list = acts.findByUserIdOrderByDateDescIdDesc(id);
        LocalDate t = LocalDate.now();
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("user", u);
        m.put("totalActivities", list.size());
        m.put("badges", BADGES.entrySet().stream().filter(e -> u.totalPoints >= e.getValue()).map(Map.Entry::getKey).toList());
        m.put("today", sum(list, t));
        m.put("week", sum(list, t.minusDays(6)));
        m.put("month", sum(list, t.minusDays(29)));
        m.put("co2Total", round(u.totalCo2Saved));
        m.put("co2Today", round(co2Sum(list, t)));
        m.put("co2Week", round(co2Sum(list, t.minusDays(6))));
        m.put("co2Month", round(co2Sum(list, t.minusDays(29))));
        m.put("recent", list.stream().limit(10).toList());
        return m;
    }

    @GetMapping("/leaderboard")
    List<User> leaderboard() { return users.findTop10ByOrderByTotalPointsDesc(); }

    private static int sum(List<Activity> l, LocalDate from) {
        return l.stream().filter(a -> !a.date.isBefore(from)).mapToInt(a -> a.points).sum();
    }

    private static double co2Sum(List<Activity> l, LocalDate from) {
        return l.stream().filter(a -> !a.date.isBefore(from)).mapToDouble(a -> a.co2Saved).sum();
    }

    private static double round(double v) { return Math.round(v * 100.0) / 100.0; }
}