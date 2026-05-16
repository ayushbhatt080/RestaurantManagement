package com.edutech.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.edutech.model.Feedback;
import com.edutech.service.FeedbackService;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {
    @Autowired
    private FeedbackService service;

    @PostMapping
    public ResponseEntity<?> submitFeedback(@RequestBody Feedback feedback){
        try {
            Feedback obj = service.submitFeedback(feedback);
            return new ResponseEntity<>(feedback,HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<?> viewAllFeedbacks(){
        try {
            List<Feedback> list = service.getAllFeedbacks();
            return new ResponseEntity<>(list,HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/menu/{menuItemId}")
    public ResponseEntity<?> viewFeedBackByMenuItem(@PathVariable Long menuItemId){
        try {
            List<Feedback> list = service.getFeedbacksByMenu(menuItemId);
            return new ResponseEntity<>(list,HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
 @PutMapping("/{id}/reply")
    public ResponseEntity<?> replyToFeedback(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        try {
            String response = request.get("response");

            Feedback updatedFeedback = service.replyToFeedback(id, response);

            return new ResponseEntity<>(updatedFeedback, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

