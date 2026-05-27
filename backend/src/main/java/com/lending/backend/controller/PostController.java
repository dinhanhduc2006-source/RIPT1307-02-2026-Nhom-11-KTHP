package com.lending.backend.controller;

import com.lending.backend.common.ResponseResult;
import com.lending.backend.entity.Post;
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
    public ResponseResult<Post> create(@RequestBody Post post, @RequestParam Long authorId) {
        return ResponseResult.success(postService.createPost(post, authorId));
    }

    @DeleteMapping("/{id}")
    public ResponseResult<String> delete(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseResult.success("Post deleted");
    }
}
