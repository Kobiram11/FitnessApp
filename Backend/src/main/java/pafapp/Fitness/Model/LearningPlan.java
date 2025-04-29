package com.example.learningplan.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

@Entity
@Table(name = "learning_plans")
public class LearningPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Title must be less than 100 characters")
    @Column(nullable = false, length = 100)
    private String title;

    @NotBlank(message = "Subject is required")
    @Size(max = 50, message = "Subject must be less than 50 characters")
    @Column(nullable = false, length = 50)
    private String subject;

    @NotBlank(message = "Topic is required")
    @Size(max = 50, message = "Topic must be less than 50 characters")
    @Column(nullable = false, length = 50)
    private String topics;

    @NotBlank(message = "Resources are required")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String resources;

    @FutureOrPresent(message = "Date must be today or in the future")
    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private boolean savePlan = false;

    @Column(name = "created_at", updatable = false)
    private LocalDate createdAt;

    @Column(name = "updated_at")
    private LocalDate updatedAt;

    // JPA Lifecycle Callbacks
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDate.now();
        this.updatedAt = LocalDate.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDate.now();
    }

    // Constructors
    public LearningPlan() {
    }

    public LearningPlan(String title, String subject, String topics, String resources, LocalDate date, boolean savePlan) {
        this.title = title;
        this.subject = subject;
        this.topics = topics;
        this.resources = resources;
        this.date = date;
        this.savePlan = savePlan;
    }

    // Getters and Setters
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

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public boolean isSavePlan() {
        return savePlan;
    }

    public void setSavePlan(boolean savePlan) {
        this.savePlan = savePlan;
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public LocalDate getUpdatedAt() {
        return updatedAt;
    }

    @Override
    public String toString() {
        return "LearningPlan{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", subject='" + subject + '\'' +
                ", topics='" + topics + '\'' +
                ", resources='" + resources + '\'' +
                ", date=" + date +
                ", savePlan=" + savePlan +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}