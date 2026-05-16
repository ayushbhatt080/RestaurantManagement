package com.edutech.service;

import java.util.List;

import com.edutech.model.Feedback;

public interface FeedbackService {
	Feedback submitFeedback(Feedback feedback);
	List<Feedback> getAllFeedbacks();
	List<Feedback> getFeedbacksByMenu(Long menuItemId);
    Feedback replyToFeedback(Long id, String response);
}