package com.pi.forum.service;

import com.pi.forum.entities.Post;
import com.pi.forum.repository.PostRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class PostService {
    private final PostRepository postRepository;

    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    public Post getPostById(int id) {
        return postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));
    }

    public Post updatePost(int id, Post updatedPost) {
        Post post = getPostById(id);
        post.setContent(updatedPost.getContent());
        return postRepository.save(post);
    }
    public void deletePost(int id) {
        postRepository.deleteById(id);
    }
    public Page<Post> getAllPosts(Pageable pageable) {
        return postRepository.findAll(pageable);
    }
}
