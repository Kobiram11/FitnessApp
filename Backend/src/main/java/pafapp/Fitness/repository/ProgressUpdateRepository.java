package pafapp.Fitness.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import pafapp.Fitness.Model.ProgressUpdate;

public interface ProgressUpdateRepository  extends JpaRepository<ProgressUpdate, Long>{
     List<ProgressUpdate> findByUserId(String userId);
    
}
