package com.example.learningplan.service;

import com.example.learningplan.dto.LearningPlanDTO;
import com.example.learningplan.model.LearningPlan;
import com.example.learningplan.repository.LearningPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LearningPlanService {

    private final LearningPlanRepository learningPlanRepository;

    @Autowired
    public LearningPlanService(LearningPlanRepository learningPlanRepository) {
        this.learningPlanRepository = learningPlanRepository;
    }

    public LearningPlanDTO createLearningPlan(LearningPlanDTO learningPlanDTO) {
        LearningPlan learningPlan = convertToEntity(learningPlanDTO);
        LearningPlan savedPlan = learningPlanRepository.save(learningPlan);
        return convertToDTO(savedPlan);
    }

    public List<LearningPlanDTO> getAllLearningPlans() {
        return learningPlanRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public LearningPlanDTO getLearningPlanById(Long id) {
        Optional<LearningPlan> plan = learningPlanRepository.findById(id);
        return plan.map(this::convertToDTO).orElse(null);
    }

    public LearningPlanDTO updateLearningPlan(Long id, LearningPlanDTO learningPlanDTO) {
        Optional<LearningPlan> existingPlan = learningPlanRepository.findById(id);
        if (existingPlan.isPresent()) {
            LearningPlan planToUpdate = existingPlan.get();
            planToUpdate.setTitle(learningPlanDTO.getTitle());
            planToUpdate.setSubject(learningPlanDTO.getSubject());
            planToUpdate.setTopics(learningPlanDTO.getTopics());
            planToUpdate.setResources(learningPlanDTO.getResources());
            planToUpdate.setDate(convertStringToDate(learningPlanDTO.getDate()));
            planToUpdate.setSavePlan(learningPlanDTO.isSavePlan());

            LearningPlan updatedPlan = learningPlanRepository.save(planToUpdate);
            return convertToDTO(updatedPlan);
        }
        return null;
    }

    public void deleteLearningPlan(Long id) {
        learningPlanRepository.deleteById(id);
    }

    private LearningPlan convertToEntity(LearningPlanDTO dto) {
        LearningPlan plan = new LearningPlan();
        plan.setTitle(dto.getTitle());
        plan.setSubject(dto.getSubject());
        plan.setTopics(dto.getTopics());
        plan.setResources(dto.getResources());
        plan.setDate(convertStringToDate(dto.getDate()));
        plan.setSavePlan(dto.isSavePlan());
        return plan;
    }

    private LearningPlanDTO convertToDTO(LearningPlan plan) {
        LearningPlanDTO dto = new LearningPlanDTO();
        dto.setId(plan.getId());
        dto.setTitle(plan.getTitle());
        dto.setSubject(plan.getSubject());
        dto.setTopics(plan.getTopics());
        dto.setResources(plan.getResources());
        dto.setDate(convertDateToString(plan.getDate()));
        dto.setSavePlan(plan.isSavePlan());
        return dto;
    }

    private LocalDate convertStringToDate(String dateString) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        return LocalDate.parse(dateString, formatter);
    }

    private String convertDateToString(LocalDate date) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        return date.format(formatter);
    }
}