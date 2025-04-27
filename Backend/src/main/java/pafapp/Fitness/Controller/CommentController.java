package pafapp.Fitness.Controller;

import lombok.RequiredArgsConstructor;
import pafapp.Fitness.Dto.CommentDto;
import pafapp.Fitness.Model.Comment;
import pafapp.Fitness.Service.PostCommentService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/posts/{postId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final PostCommentService commentService;

    // GET: Get all comments for a post
    @GetMapping
    public ResponseEntity<List<Comment>> getCommentsForPost(@PathVariable Long postId) {
        List<Comment> comments = commentService.getCommentsForPost(postId);
        return new ResponseEntity<>(comments, HttpStatus.OK);
    }

    // POST: Add a comment to a post
    @PostMapping
    public ResponseEntity<Comment> addCommentToPost(
            @PathVariable Long postId,
            @RequestBody CommentDto request
    ) {
        Comment comment = commentService.addCommentToPost(
                postId,
                request.getContent(),
                request.getCommentBy(),
                request.getCommentById(),
                request.getCommentByProfile()
        );
        return new ResponseEntity<>(comment, HttpStatus.CREATED);
    }

    // DELETE: Remove a comment from a post
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long postId,
            @PathVariable Long commentId
    ) {
        commentService.deleteComment(postId, commentId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // PUT: Edit a comment
    @PutMapping("/{commentId}")
    public ResponseEntity<Comment> editComment(
            @PathVariable Long commentId,
            @RequestBody CommentDto request
    ) {
        Comment editedComment = commentService.editComment(commentId, request.getContent());
        if (editedComment != null) {
            return new ResponseEntity<>(editedComment, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
