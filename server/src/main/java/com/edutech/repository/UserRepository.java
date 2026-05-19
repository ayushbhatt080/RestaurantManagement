package com.edutech.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.edutech.model.Role;
import com.edutech.model.User;

@Repository
public interface UserRepository extends JpaRepository<User,Long>{
	Optional<User> findByUsername(String username);


	Optional<User> findByEmail(String email);
	Optional<User> findByResetToken(String resetToken);
	List<User> findByRole(Role role);

	
}
