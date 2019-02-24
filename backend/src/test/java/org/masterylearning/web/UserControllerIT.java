package org.masterylearning.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.masterylearning.domain.User;
import org.masterylearning.dto.in.ChangePasswordDto;
import org.masterylearning.service.PasswordService;
import org.masterylearning.service.UserFacade;
import org.masterylearning.service.UserService;
import org.mockito.Mockito;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 *
 */
@RunWith (SpringRunner.class)
@AutoConfigureMockMvc
@SpringBootTest
@Transactional
public class UserControllerIT {

    @Inject MockMvc mockMvc;

    @Inject ObjectMapper objectMapper;
    @Inject UserService userService;

    @MockBean PasswordService passwordService;
    @MockBean UserFacade userFacade;

    @Before
    public void setupTestUser () {
        userService.createUser ("test", "test@test.com", "test", "test");
    }

    @Test
    public void loginWithoutUser_shouldBeUnauthorized () throws Exception {

        RequestBuilder request = get ("/users/current").contentType (MediaType.APPLICATION_JSON_UTF8);

        mockMvc.perform (request)
               .andExpect (status().isUnauthorized ());
    }

    @Test
    @WithMockUser
    public void loginWithUser_shouldSucceed () throws Exception {

        RequestBuilder request = get("/users/current").contentType (MediaType.APPLICATION_JSON_UTF8);

        mockMvc.perform (request)
               .andExpect (status ().isOk ());
    }

    @Test
    @WithMockUser
    public void passwordChange_shouldSucceed () throws Exception {

        User testUser = new User ("test", "test@test.com", "test", "test");

        when (userFacade.getCurrentUser ())
                .thenReturn (testUser);

        ChangePasswordDto value = new ChangePasswordDto ();
        value.oldPassword = "test";
        value.newPassword = "test-new";

        RequestBuilder request = post("/users/current/password")
                .contentType (MediaType.APPLICATION_JSON_UTF8)
                .content (objectMapper.writeValueAsString (value));

        mockMvc.perform (request)
               .andExpect (status ().isOk ());

        Mockito.verify (passwordService).changePassword (eq(testUser), eq("test"), eq("test-new"));
    }
}
