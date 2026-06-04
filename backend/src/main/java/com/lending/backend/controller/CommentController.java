package com.lending.backend.controller;

import com.lending.backend.common.ResponseResult;
import com.lending.backend.entity.Comment;
import com.lending.backend.entity.User;
import com.lending.backend.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/post/{postId}")
    public ResponseResult<List<Comment>> getByPost(@PathVariable("postId") Long postId) {
        return ResponseResult.success(commentService.getByPost(postId));
    }

    @PostMapping("/post/{postId}")
    public ResponseResult<Comment> create(@PathVariable("postId") Long postId, @RequestBody Comment comment) {
        User currentUser = (User) org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseResult.success(commentService.create(comment, postId, currentUser.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseResult<String> delete(@PathVariable("id") Long id) {
        commentService.delete(id);
        return ResponseResult.success("Comment deleted");
    }
}
