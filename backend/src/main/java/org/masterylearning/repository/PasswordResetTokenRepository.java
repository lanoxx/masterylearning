package org.masterylearning.repository;

import org.masterylearning.domain.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 */
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    public PasswordResetToken findPasswordResetTokenByToken (String token);

    public List<PasswordResetToken> findPasswordResetTokenByUser_Username (String username);
}
