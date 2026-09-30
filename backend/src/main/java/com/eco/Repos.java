package com.eco;

import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

interface UserRepo extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findTop10ByOrderByTotalPointsDesc();
}

interface ActivityRepo extends JpaRepository<Activity, Long> {
    List<Activity> findByUserIdOrderByDateDescIdDesc(Long userId);
    void deleteByUserId(Long userId);
}
