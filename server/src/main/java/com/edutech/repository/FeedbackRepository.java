package com.edutech.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.edutech.model.Feedback;

public interface FeedbackRepository extends JpaRepository<Feedback,Long> {
   List<Feedback> findByMenuItemId(Long menuItemId);
}
