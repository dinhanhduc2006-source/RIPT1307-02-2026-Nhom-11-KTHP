package com.lending.backend.service.impl;

import com.lending.backend.entity.Post;
import com.lending.backend.entity.User;
import com.lending.backend.exception.AppException;
import com.lending.backend.exception.ErrorCode;
import com.lending.backend.repository.PostRepository;
import com.lending.backend.repository.UserRepository;
import com.lending.backend.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Override
    public Post createPost(Post post, Long authorId) {
        User author = userRepository.findById(authorId).orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        post.setAuthor(author);
        return postRepository.save(post);
    }

    @Override
    public List<Post> getAll() {
        return postRepository.findAll();
    }

    @Override
    public Post getById(Long id) {
        return postRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
    }

    @Override
    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }
}
