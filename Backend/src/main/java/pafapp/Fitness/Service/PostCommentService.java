package pafapp.Fitness.Service;

import java.util.List;

import pafapp.Fitness.Model.Comment;

public interface PostCommentService {
    
    List<Comment> getCommentsForPost(Long postId);

    Comment addCommentToPost(Long postId, String content, String commentBy, String commentById, String commentByProfile);

    void deleteComment(Long postId, Long commentId);

    Comment editComment(Long commentId, String content);
}