package org.masterylearning.service;

import org.masterylearning.domain.Course;
import org.masterylearning.domain.CourseHistory;
import org.masterylearning.domain.Entry;
import org.masterylearning.domain.EntryHistory;
import org.masterylearning.domain.User;
import org.masterylearning.repository.CourseHistoryRepository;
import org.masterylearning.repository.EntryHistoryRepository;
import org.masterylearning.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.inject.Inject;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * The History service is responsible to handle the history related resources for a given user.
 */
@Service
public class HistoryService {

    @Inject CourseHistoryRepository courseHistoryRepository;
    @Inject EntryHistoryRepository entryHistoryRepository;
    @Inject UserRepository userRepository;

    @Transactional
    public List<CourseHistory> addActiveCourses (List<Course> all) {
        Object principal = SecurityContextHolder.getContext ().getAuthentication ().getPrincipal ();

        List<CourseHistory> courseHistoryList = null;

        if (principal instanceof User) {
            Long userId = ((User) principal).id;

            // The user object stored in the principal of the security context is no longer bound
            // to an active hibernate session, so we need to reload the user.
            Optional<User> maybeUser = userRepository.findById (userId);

            if (!maybeUser.isPresent ()) {
                return null;
            }

            User user = maybeUser.get ();

            courseHistoryList = user.getCourseHistoryList ();
            for (Course course : all) {
                boolean found = false;
                for (CourseHistory courseHistory : courseHistoryList) {
                    if (courseHistory.course.id.equals (course.id)) {
                        found = true;
                        break;
                    }
                }

                // If the course was not found, then we add it to the users course history
                // additionally we add the first entry to the users entry history for that course
                if (!found) {
                    CourseHistory courseHistory = new CourseHistory ();
                    courseHistory.course = course;
                    courseHistory.created = LocalDateTime.now ();

                    Optional<Entry> first = course.getChildren ().stream ().findFirst ();
                    Entry entry = first.isPresent () ? first.get () : null;

                    courseHistory.user = user;
                    courseHistory.lastEntry = entry;

                    courseHistoryList.add (courseHistory);
                    courseHistoryRepository.saveAll (courseHistoryList);

                    EntryHistory entryHistory = new EntryHistory ();
                    entryHistory.courseHistory = courseHistory;
                    entryHistory.course = course;
                    entryHistory.entry = entry;
                    entryHistory.user = user;
                    entryHistory.created = LocalDateTime.now ();

                    List<EntryHistory> entryHistoryList = courseHistory.getEntryHistoryList ();
                    entryHistoryList.add (entryHistory);

                    entryHistoryRepository.saveAll (entryHistoryList);
                }
            }
        }

        return courseHistoryList;
    }

    @Transactional
    public CourseHistory getCourseHistory (Long courseId) {

        Object principal = SecurityContextHolder.getContext ().getAuthentication ().getPrincipal ();

        Long userId;
        if (principal instanceof User) {

            User user = (User) principal;
            userId = user.id;
        } else {
            return null;
        }

        Optional<User> maybeUser = userRepository.findById (userId);

        if (!maybeUser.isPresent ()) {
            return null;
        }

        User user = maybeUser.get ();

        Optional<CourseHistory> first
                = user.getCourseHistoryList ()
                      .stream ()
                      .filter (courseHistory -> courseHistory.course.id.equals (courseId))
                      .findFirst ();

        return first.orElse (null);

    }


    @Transactional
    public EntryHistory findEntryHistory (User user, Long courseId, Long entryId) {

        Optional<CourseHistory> courseCandidate = user.getCourseHistoryList ().stream ().filter (courseHistory -> courseHistory.course.id.equals (courseId)).findFirst ();

        if (!courseCandidate.isPresent ())  return null;

        CourseHistory courseHistory = courseCandidate.get ();

        Optional<EntryHistory> entryCandidate = courseHistory.entryHistoryList.stream ().filter (entryHistory -> entryHistory.entry.id.equals (entryId)).findFirst ();

        if (!entryCandidate.isPresent ()) return null;

        return entryCandidate.get ();
    }

    @Transactional
    public Boolean setEntryHistoryState (EntryHistory entryHistory, String state) {
        if (entryHistory == null) {
            return false;
        }

        entryHistory.state = state;
        entryHistory.modified = LocalDateTime.now ();

        entryHistoryRepository.save (entryHistory);

        return true;
    }
}
