package org.masterylearning.web;

import org.masterylearning.domain.Course;
import org.masterylearning.domain.CourseHistory;
import org.masterylearning.domain.Entry;
import org.masterylearning.domain.EntryHistory;
import org.masterylearning.domain.User;
import org.masterylearning.domain.data.ContinueButton;
import org.masterylearning.domain.data.EntryData;
import org.masterylearning.domain.data.Exercise;
import org.masterylearning.dto.in.EntryStateDto;
import org.masterylearning.dto.in.EnumerationInDto;
import org.masterylearning.dto.out.CourseHistoryOutDto;
import org.masterylearning.dto.out.CourseOutDto;
import org.masterylearning.dto.out.EntryDataOutDto;
import org.masterylearning.dto.out.EnumerationOutDto;
import org.masterylearning.repository.CourseHistoryRepository;
import org.masterylearning.repository.CourseRepository;
import org.masterylearning.repository.EntryHistoryRepository;
import org.masterylearning.repository.UserRepository;
import org.masterylearning.service.BlockingStrategy;
import org.masterylearning.service.CourseService;
import org.masterylearning.service.HistoryService;
import org.masterylearning.service.TreeEnumerator;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.inject.Inject;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Stack;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 */
@RestController
@RequestMapping (path = "/userHistory")
public class HistoryController {

    @Inject CourseRepository courseRepository;
    @Inject EntryHistoryRepository entryHistoryRepository;
    @Inject CourseHistoryRepository courseHistoryRepository;
    @Inject CourseService courseService;
    @Inject HistoryService historyService;
    @Inject UserRepository userRepository;

    @CrossOrigin
    @RequestMapping (method = RequestMethod.GET, path = "/activeCourses")
    @Transactional
    public List<CourseHistoryOutDto>
    getActiveCourses ()
    {
        List<Course> all = courseRepository.findAll ();

        // This is a temporary workaround. We add all courses to the users list of active courses.
        // In a future version we should have a means to register a student for a course, which would
        // then put that course into the students list of active courses. Once this is in place we could
        // load the list of active courses for the currently authenticated user here, rather then
        // loading all courses from the database.
        List<CourseHistory> courseHistories = historyService.addActiveCourses (all);

        List<CourseHistoryOutDto> results = new ArrayList<> ();

        results.addAll (courseHistories.stream ()
                                       .map (toDto ())
                                       .collect (Collectors.toList()));

        return results;
    }

    private Function<CourseHistory, CourseHistoryOutDto> toDto () {
        return courseHistory -> {
            CourseHistoryOutDto courseHistoryOutDto = new CourseHistoryOutDto ();
            courseHistoryOutDto.courseOutDto = new CourseOutDto (courseHistory.course);
            if (courseHistory.lastEntry != null) {
                courseHistoryOutDto.lastEntryId = courseHistory.lastEntry.id;
            }

            return courseHistoryOutDto;
        };
    }

    @CrossOrigin
    @RequestMapping (method = RequestMethod.GET, path = "/courses/{courseId}")
    @Transactional
    public List<EntryDataOutDto> getTableOfContents (@PathVariable Long courseId) {
        Course course;
        List<Entry> tableOfContents;
        CourseHistory courseHistory;
        List<EntryHistory> entryHistoryList;

        if (courseId == null) {
            return null;
        }

        course = courseRepository.findOne (courseId);

        tableOfContents = courseService.getTableOfContents (course);

        courseHistory = historyService.getCourseHistory (courseId);

        entryHistoryList = courseHistory.getEntryHistoryList ();

        List<EntryDataOutDto> result = new ArrayList<> ();
        if (tableOfContents != null) {
            for (Entry entry : tableOfContents) {
                EntryDataOutDto outDto = entry.data.toDto ();
                entryHistoryList.stream ()
                                .filter (entryHistory -> entry.id.equals (entryHistory.entry.id))
                                .forEach (entryHistory -> {
                                    outDto.state = entryHistory.state;
                                    outDto.seen = true;
                                });
                result.add (outDto);
            }
        }

        return result;
    }

    @CrossOrigin
    @RequestMapping(path = "/courses/{courseId}/enumerate", method = RequestMethod.POST)
    @Transactional
    public EnumerationOutDto enumerateEntries (@PathVariable Long courseId, @RequestBody EnumerationInDto inDto) {

        Object principal = SecurityContextHolder.getContext ()
                                                .getAuthentication ()
                                                .getPrincipal ();

        if (!(principal instanceof User)) {
            return null;
        }

        User user = (User) principal;

        Entry root;
        CourseHistory courseHistory;
        List<EntryHistory> entryHistoryList;
        EnumerationOutDto dto = new EnumerationOutDto ();

        Course course = courseRepository.findOne (courseId);

        if (course == null) {
            //TODO return error
            return null;
        }

        courseHistory = historyService.getCourseHistory (courseId);

        entryHistoryList = courseHistory.getEntryHistoryList ();

        // this blocking strategy blocks on ContinueButtons and Exercises but only
        // if the user has not previously seen the entry, that is the entry is not
        // in his history yet
        BlockingStrategy blockingStrategy = entry -> {
            boolean blockingCandidate = entry.data instanceof ContinueButton || entry.data instanceof Exercise;
            if (blockingCandidate) {
                Optional<Boolean> first = entryHistoryList.stream ()
                                                          .filter (entryHistory -> entryHistory.entry.id.equals (entry.id))
                                                          .map (entryHistory -> {
                                                              if (entry.data instanceof ContinueButton) {
                                                                  // the entry is already in the users history: dont block
                                                                  return false;
                                                              }
                                                              if (entry.data instanceof Exercise) {
                                                                  // no state, so the exercise has not been answered: block
                                                                  if (entryHistory.state == null) {
                                                                      return true;
                                                                  }
                                                              }
                                                              // default: don't block
                                                              return false;
                                                          })
                                                          .findFirst ();
                return first.isPresent () ? first.get () : true;
            }
            return false;
        };

        /**
         * We have received a list of entryIds from the client. Each entryId is the current position in an
         * entry tree where we enumeration was previously blocked. Blocks can happen either because we encountered
         * an exercise or a continue button. If we have previously blocked on an exercise then the client will
         * not only sent the id of the correct/incorrect link, which points to the location of the exercise subtree
         * that we are going to enumerate next. But it also sends the ids of entries where we previously blocked.
         *
         * Once the enumeration of the exercise subtree has completed we can use the remaining entry ids to resume
         * enumeration in another subtree.
         *
         * The following list gives an overview of cases we can encounter:
         *
         *  1. We start enumeration from the top of the stack
         *  2. When the enumeration returns we distinguish two options:
         *    a) We blocked on some entry X, then we need to push the next id in the subtree
         *       on the stack and return the stack and the currently enumerated entries to the
         *       client.
         *    b) We did not block, then the enumeration of the current subtree
         *       was completed and we need to check the stack to see if there more entries which
         *       need to be enumerated.
         */
        Stack<Long> stack = new Stack<> ();
        inDto.entryIds.forEach (stack::push);

        while (stack.size () > 0) {
            root = courseService.find (course, stack.pop ());

            TreeEnumerator treeEnumerator = new TreeEnumerator (root, blockingStrategy);
            List<EntryData> entryDatas = treeEnumerator.enumerateTree ();

            List<EntryDataOutDto> entryDataOutDtoList
                    = entryDatas.stream ()
                                .map (entry -> mapToEntryDataOutDto (courseHistory, entryHistoryList, course, entry))
                                .filter (outDto -> !(outDto.type.equals ("continue-button") && outDto.seen))
                                .collect(Collectors.toList());

            dto.entries.addAll (entryDataOutDtoList);

            dto.scrollLocation = getLastSeenEntryId (dto.entries);

            // we blocked on some entry, so we need to compute the
            // next enumeration id and break out from the loop
            if (treeEnumerator.entryStack.size () > 0) {
                Entry next = treeEnumerator.entryStack.peek ();
                stack.push (next.id);
                break;
            }
        }

        dto.nextIds = stack;
        return dto;
    }

    private EntryDataOutDto mapToEntryDataOutDto (CourseHistory courseHistory, List<EntryHistory> entryHistoryList, Course course, EntryData entry) {
        Optional<EntryHistory> entryHistory = getEntryHistory (entryHistoryList, entry.container);
        EntryDataOutDto outDto = entry.toDto ();

        if (!entryHistory.isPresent ()) {
            addEntryToUserHistory (entryHistoryList, courseHistory, course, entry.container);
        } else {
            outDto.state = entryHistory.get ().state;
            outDto.seen = true;
        }
        return outDto;
    }

    private Long getLastSeenEntryId (List<EntryDataOutDto> entries) {
        List<Long> locations = entries.stream ()
                                          .filter (entryOut -> entryOut.seen)
                                          .map (entryOut -> entryOut.id)
                                          .collect (Collectors.toList ());

        return locations.size () > 0
                ? locations.get (locations.size () - 1)
                : null;
    }

    private Optional<EntryHistory> getEntryHistory (List<EntryHistory> entryHistoryList, Entry entry) {
        return entryHistoryList.stream ()
                               .filter (entryHistory -> entryHistory.entry.id.equals (entry.id))
                               .findFirst ();
    }

    private void addEntryToUserHistory (List<EntryHistory> entryHistoryList, CourseHistory courseHistory, Course course, Entry entry) {
        EntryHistory entryHistory = new EntryHistory ();
        entryHistory.courseHistory = courseHistory;
        entryHistory.entry = entry;
        entryHistory.course = course;
        entryHistory.created = LocalDateTime.now ();
        entryHistoryList.add (entryHistory);
        entryHistoryRepository.save (entryHistoryList);

        courseHistory.modified = LocalDateTime.now ();
        courseHistory.lastEntry = entry;
        courseHistoryRepository.save (courseHistory);
    }

    @CrossOrigin
    @RequestMapping (method = RequestMethod.POST, path = "/courses/{courseId}/entries/{entryId}")
    public Boolean
    setEntryState (@PathVariable Long courseId, @PathVariable Long entryId, @RequestBody EntryStateDto stateDto) {

        Object principal = SecurityContextHolder.getContext ().getAuthentication ().getPrincipal ();

        Long userId;
        if (principal instanceof User) {
            User user = (User) principal;
            userId = user.id;
        } else {
            return false;
        }

        User user = userRepository.findOne (userId);

        EntryHistory entryHistory = historyService.findEntryHistory (user, courseId, entryId);

        return historyService.setEntryHistoryState (entryHistory, stateDto.state);
    }
}
