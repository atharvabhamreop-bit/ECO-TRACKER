package com.eco;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Activity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) public Long id;
    public Long userId;
    public String activityName;
    public int points;
    @Column(name = "activity_date") public LocalDate date;
}
