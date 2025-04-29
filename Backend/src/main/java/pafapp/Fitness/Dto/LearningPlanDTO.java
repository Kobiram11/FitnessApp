package com.example.learningplan.dto;

import java.time.LocalDate;

public class LearningPlanDTO {
    private Long id;
    private String title;
    private String subject;
    private String topics;
    private String resources;
    private String date;
    private boolean savePlan;

    // Constructors, getters, and setters
    public LearningPlanDTO() {
    }

    public LearningPlanDTO(Long id, String title, String subject, String topics, String resources, String date,
            boolean savePlan) {
        this.id = id;
        this.title = title;
        this.subject = subject;
        this.topics = topics;
        this.resources = resources;
        this.date = date;
        this.savePlan = savePlan;
    }

    // Getters and setters for all fields
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getTopics() {
        return topics;
    }

    public void setTopics(String topics) {
        this.topics = topics;
    }

    public String getResources() {
        return resources;
    }

    public void setResources(String resources) {
        this.resources = resources;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public boolean isSavePlan() {
        return savePlan;
    }

    public void setSavePlan(boolean savePlan) {
        this.savePlan = savePlan;
    }
}