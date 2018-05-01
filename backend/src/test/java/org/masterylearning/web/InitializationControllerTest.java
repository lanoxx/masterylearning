package org.masterylearning.web;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.BlockJUnit4ClassRunner;
import org.masterylearning.UserUtility;
import org.masterylearning.dto.in.CreateUserDto;
import org.masterylearning.dto.out.CreateUserOutDto;
import org.masterylearning.repository.UserRepository;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.*;

/**
 */
@RunWith(BlockJUnit4ClassRunner.class)
public class InitializationControllerTest {

    @InjectMocks
    private InitializationController initializationController;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserController userController;

    @Before
    public void before () {
        MockitoAnnotations.initMocks (this);
    }

    /**
     *
     */
    @Test
    public void testInitialBootstrapSucceeds () {

        CreateUserDto dto = UserUtility.getCreateUserDto ();

        // reset roles to ensure they are added back by the initialization controller
        dto.roles = null;

        when (userRepository.count ()).thenReturn (0L);

        CreateUserOutDto initialUser = initializationController.createInitialUser (dto);

        verify (userController, times (1)).createUserFromDto (dto);

        assertTrue (dto.roles.size () == 3);
    }

    @Test
    public void testDoubleBootstrapFails () {

        CreateUserDto dto = UserUtility.getCreateUserDto ();

        when (userRepository.count ()).thenReturn (1L);

        CreateUserOutDto initialUser = initializationController.createInitialUser (dto);

        verify (userController, times (0)).createUserFromDto (dto);

    }
}
