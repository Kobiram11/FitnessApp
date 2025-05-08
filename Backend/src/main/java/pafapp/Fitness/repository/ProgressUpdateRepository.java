package pafapp.Fitness.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import pafapp.Fitness.Model.ProgressUpdate;

public interface ProgressUpdateRepository  extends JpaRepository<ProgressUpdate, Long>{
    
}
