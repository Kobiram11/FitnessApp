package pafapp.Fitness.Service;


import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;

import pafapp.Fitness.Dto.PostDto;
import pafapp.Fitness.Model.Post;

public interface PostService {

    List<Post> getAllPosts();

    Optional<Post> getPostById(Long id);

    Post createPost(Post post);

    ResponseEntity<Post> editPost(PostDto postDTO);

    void deletePost(Long id);

    ResponseEntity<Object> likePost(String postId, String userId);

    List<Post> getPostsByUserId(String userId);
}
