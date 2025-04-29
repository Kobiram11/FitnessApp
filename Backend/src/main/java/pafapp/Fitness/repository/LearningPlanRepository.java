package com.example.learningplan.repository;

import com.example.learningplan.model.LearningPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LearningPlanRepository extends JpaRepository<LearningPlan, Long> {
}