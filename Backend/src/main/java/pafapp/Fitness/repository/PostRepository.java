package pafapp.Fitness.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import pafapp.Fitness.Model.Post;

public interface PostRepository extends JpaRepository <Post, Long> {

    List<Post> findByUserId(String userId);
    
}