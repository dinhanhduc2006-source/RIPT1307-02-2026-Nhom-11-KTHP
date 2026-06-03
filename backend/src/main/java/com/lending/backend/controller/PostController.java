package com.lending.backend.controller;

import com.lending.backend.common.ResponseResult;
import com.lending.backend.entity.Post;
import com.lending.backend.entity.User;
import com.lending.backend.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping
    public ResponseResult<List<Post>> getAll() {
        return ResponseResult.success(postService.getAll());
    }

    @PostMapping
    public ResponseResult<Post> create(@RequestBody Post post) {
        User currentUser = (User) org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseResult.success(postService.createPost(post, currentUser.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseResult<String> delete(@PathVariable("id") Long id) {
        postService.deletePost(id);
        return ResponseResult.success("Post deleted");
    }

    @PatchMapping("/{id}/upvote")
    public ResponseResult<String> upvote(@PathVariable("id") Long id) {
        postService.upvotePost(id);
        return ResponseResult.success("Upvoted");
    }

    @PatchMapping("/{id}/downvote")
    public ResponseResult<String> downvote(@PathVariable("id") Long id) {
        postService.downvotePost(id);
        return ResponseResult.success("Downvoted");
    }
}
