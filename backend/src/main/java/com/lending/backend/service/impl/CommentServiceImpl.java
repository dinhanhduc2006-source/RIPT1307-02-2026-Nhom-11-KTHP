package com.lending.backend.service.impl;

import com.lending.backend.entity.Comment;
import com.lending.backend.entity.Post;
import com.lending.backend.entity.User;
import com.lending.backend.exception.AppException;
import com.lending.backend.exception.ErrorCode;
import com.lending.backend.repository.CommentRepository;
import com.lending.backend.repository.PostRepository;
import com.lending.backend.repository.UserRepository;
import com.lending.backend.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public Comment create(Comment comment, Long postId, Long authorId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        User author = userRepository.findById(authorId).orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        
        comment.setPost(post);
        comment.setAuthor(author);
        
        Comment saved = commentRepository.save(comment);
        
        // Update post comment count
        post.setComments((post.getComments() == null ? 0 : post.getComments()) + 1);
        postRepository.save(post);
        
        return saved;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Comment> getByPost(Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtDesc(postId);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Comment comment = commentRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        Post post = comment.getPost();
        
        commentRepository.deleteById(id);
        
        if (post.getComments() != null && post.getComments() > 0) {
            post.setComments(post.getComments() - 1);
            postRepository.save(post);
        }
    }
}
