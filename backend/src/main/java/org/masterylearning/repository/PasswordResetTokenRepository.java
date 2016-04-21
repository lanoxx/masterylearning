package org.masterylearning.repository;

import org.masterylearning.domain.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 */
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    public PasswordResetToken findPasswordResetTokenByToken (String token);
}
