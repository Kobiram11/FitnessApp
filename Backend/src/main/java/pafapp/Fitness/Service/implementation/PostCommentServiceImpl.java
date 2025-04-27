package pafapp.Fitness.Service.implementation;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import pafapp.Fitness.Model.Comment; 
import pafapp.Fitness.Model.Post;    
import pafapp.Fitness.Service.PostCommentService;
import pafapp.Fitness.repository.CommentRepository; 
import pafapp.Fitness.repository.PostRepository;    

import java.util.Date;
import java.util.List;

@Service
@AllArgsConstructor
public class PostCommentServiceImpl implements PostCommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    @Override
    public List<Comment> getCommentsForPost(Long postId) {
        return commentRepository.findByPostId(postId);
    }

    @Override
    public Comment addCommentToPost(Long postId, String content, String commentBy, String commentById, String commentByProfile) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));

        Comment comment = new Comment();
        comment.setContent(content);
        comment.setCommentBy(commentBy);
        comment.setCommentById(commentById);
        comment.setCommentByProfile(commentByProfile);
        comment.setCreatedAt((java.sql.Date) new Date());
        comment.setPost(post);

        return commentRepository.save(comment);
    }

    @Override
    public void deleteComment(Long postId, Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + commentId));

        if (!comment.getPost().getId().equals(postId)) {
            throw new RuntimeException("Comment does not belong to the specified post");
        }
        commentRepository.delete(comment);
    }

    @Override
    public Comment editComment(Long commentId, String content) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + commentId));

        comment.setContent(content);
        return commentRepository.save(comment);
    }
}
