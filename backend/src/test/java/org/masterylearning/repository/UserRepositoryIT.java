package org.masterylearning.repository;

import org.hibernate.TransientObjectException;
import org.junit.Assert;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.masterylearning.domain.Course;
import org.masterylearning.domain.CourseHistory;
import org.masterylearning.domain.Entry;
import org.masterylearning.domain.Role;
import org.masterylearning.domain.User;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.env.Environment;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import java.util.LinkedList;
import java.util.List;

import static org.hamcrest.Matchers.isA;

/**
 */
@RunWith(SpringRunner.class)
@SpringBootTest
public class UserRepositoryIT {

    @Inject UserRepository userRepository;
    @Inject RoleRepository roleRepository;
    @Inject CourseRepository courseRepository;
    @Inject CourseHistoryRepository courseHistoryRepository;

    @Inject Environment environment;

    @Rule
    public ExpectedException expectedException = ExpectedException.none ();

    @Test
    @Transactional
    public void savingUserWithNewRoleShouldGiveException () {
        User user = getDefaultUser ();

        Role role = new Role ();
        role.description = "A new role, which is not yet in the database";
        role.name = "NEWROLE";

        user.getRoles ().add (role);

        userRepository.save (user);

        // we combine the expectedException rule AND the assert to ensure that the exception is not only
        // thrown but also that it has the right nested cause.
        try {
            expectedException.expectCause (isA (IllegalStateException.class));
            userRepository.flush ();
        } catch (Exception e) {
            if (e.getCause () != null) {
                Assert.assertTrue (e.getCause ().getCause () instanceof TransientObjectException);
            }
            throw e;
        }

    }

    @Test
    @Transactional
    public void deleteUserShouldNotCascadeToDeleteRoles () {

        User user = getDefaultUser ();

        Role role = roleRepository.findRoleByName ("STUDENT");

        user.getRoles ().add (role);

        user = userRepository.save (user);

        userRepository.delete (user);

        role = roleRepository.findRoleByName ("STUDENT");

        Assert.assertTrue ("Role should not be deleted, when user is deleted",
                           role != null);

    }

    private User getDefaultUser () {
        return new User ("John Doe", "foobar@foobar.com", "jdoe", "123456");
    }

    /**
     * Test that the cascade relation of the {@link User#courseHistoryList} in the User object is correctly set
     * to cascade the persist operation for the courseHistory, when the user is saved, such that
     * any courseHistory objects are also saved.
     *
     * And also to cascade the delete operation, when the user is deleted.
     *
     */
    @Test
    @Transactional
    public void deleteUserShouldCascadeToDeleteCourseHistory () {

        User user = getDefaultUser ();

        Course course = new Course ();

        Entry entry = new Entry ();

        course.children.add (entry);

        courseRepository.save (course);

        CourseHistory courseHistory = new CourseHistory ();

        courseHistory.course = course;
        courseHistory.lastEntry = entry;
        courseHistory.user = user;

        user.courseHistoryList = new LinkedList<> ();

        user.getCourseHistoryList ().add (courseHistory);

        userRepository.save (user);

        List<CourseHistory> courseHistoryByCourseId =
                courseHistoryRepository.findByCourse_Id (course.id);

        Assert.assertTrue ("CourseHistory should have been persisted, when user was persisted",
                           courseHistoryByCourseId.size () > 0);

        userRepository.delete (user);

        List<CourseHistory> byCourse_id = courseHistoryRepository.findByCourse_Id (course.id);

        Assert.assertTrue ("CourseHistory should have been deleted, when user was deleted",
                           byCourse_id.size () == 0);

    }
}
