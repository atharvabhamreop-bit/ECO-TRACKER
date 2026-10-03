package com.eco;

import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

interface UserRepo extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findTop10ByOrderByTotalPointsDesc();
}

interface ActivityRepo extends JpaRepository<Activity, Long> {
    List<Activity> findByUserIdOrderByDateDescIdDesc(Long userId);

    @Modifying
    @Query("delete from Activity a where a.userId = :userId")
    void deleteByUserId(@Param("userId") Long userId);
}