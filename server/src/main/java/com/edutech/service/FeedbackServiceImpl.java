package com.edutech.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.edutech.model.Feedback;
import com.edutech.repository.FeedbackRepository;

@Service
public class FeedbackServiceImpl implements FeedbackService{

	@Autowired
	FeedbackRepository feedbackRepository;

	@Override
	public Feedback submitFeedback(Feedback feedback) {
		return feedbackRepository.save(feedback);
	}

	@Override
	public List<Feedback> getAllFeedbacks() {
		List<Feedback> list = new ArrayList<>();
		list = feedbackRepository.findAll();
		return list;
	}

	@Override
	public List<Feedback> getFeedbacksByMenu(Long menuItemId) {
		List<Feedback> list  =  feedbackRepository.findByMenuItemId(menuItemId);
		return list;
	}

	
  @Override
    public Feedback replyToFeedback(Long id, String response) {

        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback not found with id: " + id));

        feedback.setResponse(response);

        return feedbackRepository.save(feedback);
    }

}