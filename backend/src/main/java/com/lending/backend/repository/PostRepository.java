package com.lending.backend.repository;

import com.lending.backend.entity.Post;
import com.lending.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByCategory(String category);
    List<Post> findByAuthor(User author);
}
