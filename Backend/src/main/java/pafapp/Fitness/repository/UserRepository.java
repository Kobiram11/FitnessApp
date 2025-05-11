package pafapp.Fitness.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import pafapp.Fitness.Model.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    
    User findByEmail(String email);

    

    boolean existsByEmail(String email);
}
