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
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public Post createPost(Post post, Long authorId) {
        User author = userRepository.findById(authorId).orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
        post.setAuthor(author);
        if (post.getComments() == null) post.setComments(0);
        if (post.getPositive() == null) post.setPositive(0);
        if (post.getNegative() == null) post.setNegative(0);
        return postRepository.save(post);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Post> getAll() {
        return postRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Post getById(Long id) {
        return postRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND));
    }

    @Override
    @Transactional
    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }
}
