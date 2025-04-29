package com.example.learningplan.controller;

import com.example.learningplan.dto.LearningPlanDTO;
import com.example.learningplan.service.LearningPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
@CrossOrigin(origins = "http://localhost:3000")
public class LearningPlanController {

    private final LearningPlanService learningPlanService;

    @Autowired
    public LearningPlanController(LearningPlanService learningPlanService) {
        this.learningPlanService = learningPlanService;
    }

    @PostMapping
    public ResponseEntity<LearningPlanDTO> createLearningPlan(@RequestBody LearningPlanDTO learningPlanDTO) {
        LearningPlanDTO createdPlan = learningPlanService.createLearningPlan(learningPlanDTO);
        return new ResponseEntity<>(createdPlan, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<LearningPlanDTO>> getAllLearningPlans() {
        List<LearningPlanDTO> plans = learningPlanService.getAllLearningPlans();
        return new ResponseEntity<>(plans, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LearningPlanDTO> getLearningPlanById(@PathVariable Long id) {
        LearningPlanDTO plan = learningPlanService.getLearningPlanById(id);
        if (plan != null) {
            return new ResponseEntity<>(plan, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<LearningPlanDTO> updateLearningPlan(
            @PathVariable Long id,
            @RequestBody LearningPlanDTO learningPlanDTO) {
        LearningPlanDTO updatedPlan = learningPlanService.updateLearningPlan(id, learningPlanDTO);
        if (updatedPlan != null) {
            return new ResponseEntity<>(updatedPlan, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLearningPlan(@PathVariable Long id) {
        learningPlanService.deleteLearningPlan(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}