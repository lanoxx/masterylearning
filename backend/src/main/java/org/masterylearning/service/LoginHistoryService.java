package org.masterylearning.service;

import org.masterylearning.domain.LoginHistory;
import org.masterylearning.domain.User;
import org.masterylearning.repository.LoginHistoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

/**
 *
 */
@Service
public class LoginHistoryService {

    @Inject LoginHistoryRepository loginHistoryRepository;

    @Transactional
    public void createLoginHistory (User user) {

        LoginHistory lastLogin = loginHistoryRepository.findFirstByOrderByAuthenticationTimeDesc ();

        if (lastLogin == null) {
            loginHistoryRepository.save (new LoginHistory (user));
        }

        long timeSinceLastAuthentication = ChronoUnit.SECONDS.between (lastLogin.authenticationTime, LocalDateTime.now ());

        if (timeSinceLastAuthentication > 60) {
            loginHistoryRepository.save (new LoginHistory (user));
        }
    }
}
