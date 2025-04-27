package pafapp.Fitness.Service.implementation;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import pafapp.Fitness.Dto.PostDto;
import pafapp.Fitness.Model.Post;
import pafapp.Fitness.Service.PostCommentService;
import pafapp.Fitness.Service.PostService;
import pafapp.Fitness.repository.PostRepository;

@Service
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final PostCommentService commentService;

    public PostServiceImpl(PostRepository postRepository, PostCommentService commentService) {
        this.postRepository = postRepository;
        this.commentService = commentService;
    }

    @Override
    public List<Post> getAllPosts() {
        List<Post> posts = postRepository.findAll();
        for (Post post : posts) {
            post.setComments(commentService.getCommentsForPost(post.getId()));
        }
        posts.sort(Comparator.comparing(Post::getDate).reversed());
        return posts;
    }

    @Override
    public Optional<Post> getPostById(Long id) {
        return postRepository.findById(id);
    }

    @Override
    public Post createPost(Post post) {
        post.setDate(LocalDateTime.now());
        post.setLikeCount(0);
        if (post.getLikedBy() == null) {
            post.setLikedBy(new ArrayList<>());
        }
        if (post.getSharedBy() == null) {
            post.setSharedBy(new ArrayList<>());
        }
        return postRepository.save(post);
    }

    @Override
    public ResponseEntity<Post> editPost(PostDto postDTO) {
        Post post = postRepository.findById(postDTO.getId())
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postDTO.getId()));

        try {
            post.setTitle(postDTO.getTitle());
            post.setImages(postDTO.getImages() != null ? postDTO.getImages() : Collections.emptyList());
            post.setDescription(postDTO.getDescription());
            post.setDate(LocalDateTime.now());
            post.setVideo(postDTO.getVideo());
            postRepository.save(post);

            return new ResponseEntity<>(post, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }

    @Override
    public ResponseEntity<Object> likePost(String postIdStr, String userId) {
        try {
            Long postId = Long.parseLong(postIdStr);
            Post post = postRepository.findById(postId)
                    .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));

            if (post.getLikedBy() == null) {
                post.setLikedBy(new ArrayList<>());
            }

            if (post.getLikedBy().contains(userId)) {
                post.removeLikedBy(userId);
                post.setLikeCount(post.getLikeCount() - 1);
            } else {
                post.addLikedBy(userId);
                post.setLikeCount(post.getLikeCount() + 1);
            }
            postRepository.save(post);
            return new ResponseEntity<>(post, HttpStatus.OK);

        } catch (NumberFormatException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST); // invalid postId string
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND); // post not found
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public List<Post> getPostsByUserId(String userId) {
        List<Post> posts = postRepository.findByUserId(userId);
        for (Post post : posts) {
            post.setComments(commentService.getCommentsForPost(post.getId()));
        }
        posts.sort(Comparator.comparing(Post::getDate).reversed());
        return posts;
    }
}
