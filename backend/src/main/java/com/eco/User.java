package com.eco;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity @Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) public Long id;
    public String name;
    @Column(unique = true) public String email;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY) public String password;
    public int totalPoints;
}
