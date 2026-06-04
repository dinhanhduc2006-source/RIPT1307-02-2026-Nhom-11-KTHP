package com.lending.backend.service;

import com.lending.backend.entity.Comment;
import java.util.List;

public interface CommentService {
    Comment create(Comment comment, Long postId, Long authorId);
    List<Comment> getByPost(Long postId);
    void delete(Long id);
}
