package pafapp.Fitness.Service.implementation;

import lombok.AllArgsConstructor;
import pafapp.Fitness.Dto.PostDto;
import pafapp.Fitness.Model.Post;
import pafapp.Fitness.Service.PostCommentService;
import pafapp.Fitness.repository.PostRepository;
import pafapp.Fitness.Service.PostService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@AllArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final PostCommentService commentService;

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
    public Post createPost(PostDto dto) {
        // 🔒 Validate: only one media type allowed
        boolean hasImages = dto.getImages() != null && !dto.getImages().isEmpty();
        boolean hasVideo = dto.getVideo() != null && !dto.getVideo().trim().isEmpty();

        if (hasImages && hasVideo) {
            throw new IllegalArgumentException("Only one media type (image or video) is allowed.");
        }

        if (!hasImages && !hasVideo) {
            throw new IllegalArgumentException("You must upload either an image or a video.");
        }

        Post post = new Post();
        post.setUserId(dto.getUserId());
        post.setUsername(dto.getUsername());
        post.setUserProfile(dto.getUserProfile());
        post.setTitle(dto.getTitle());
        post.setDescription(dto.getDescription());
        post.setDate(LocalDateTime.now());
        post.setLikeCount(0);
        post.setCommentsCount(0);
        post.setLikedBy(new ArrayList<>());
        post.setSharedBy(new ArrayList<>());

        if (hasImages) {
            post.setImages(dto.getImages());
            post.setVideo(null);
        } else {
            post.setImages(new ArrayList<>());
            post.setVideo(dto.getVideo());
        }

        return postRepository.save(post);
    }

    @Override
    public ResponseEntity<Post> editPost(PostDto postDTO) {
        Post post = postRepository.findById(postDTO.getId())
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postDTO.getId()));

        try {
            post.setTitle(postDTO.getTitle());
            post.setDescription(postDTO.getDescription());
            post.setDate(LocalDateTime.now());

            // Only allow one media type in updates too
            boolean hasImages = postDTO.getImages() != null && !postDTO.getImages().isEmpty();
            boolean hasVideo = postDTO.getVideo() != null && !postDTO.getVideo().trim().isEmpty();

            if (hasImages && hasVideo) {
                throw new IllegalArgumentException("Only one media type (image or video) is allowed.");
            }

            if (!hasImages && !hasVideo) {
                throw new IllegalArgumentException("You must provide at least one media type.");
            }

            if (hasImages) {
                post.setImages(postDTO.getImages());
                post.setVideo(null);
            } else {
                post.setImages(new ArrayList<>());
                post.setVideo(postDTO.getVideo());
            }

            postRepository.save(post);
            return new ResponseEntity<>(post, HttpStatus.OK);

        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
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

        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
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
