package com.lending.backend.service;

import com.lending.backend.entity.Post;
import java.util.List;

public interface PostService {
    Post createPost(Post post, Long authorId);
    List<Post> getAll();
    Post getById(Long id);
    void deletePost(Long id);
    void upvotePost(Long id);
    void downvotePost(Long id);
}
