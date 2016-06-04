package org.masterylearning.web;

import org.masterylearning.domain.view.HistoryEntriesPerUser;
import org.masterylearning.dto.out.CourseStatisticsOutDto;
import org.masterylearning.repository.CourseHistoryRepository;
import org.masterylearning.repository.EntryHistoryRepository;
import org.masterylearning.repository.EntryRepository;
import org.masterylearning.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.inject.Inject;
import java.util.List;


@RestController
@RequestMapping (path = "/statistics")
public class StatisticController {

    @Inject CourseHistoryRepository courseHistoryRepository;
    @Inject EntryHistoryRepository entryHistoryRepository;
    @Inject EntryRepository entryRepository;
    @Inject UserRepository userRepository;

    @CrossOrigin
    @RequestMapping (method = RequestMethod.GET, path = "/courseHistory/{courseId}")
    @Transactional
    public CourseStatisticsOutDto getStatistics (@PathVariable Long courseId) {

        if (courseId == null) {
            return null;
        }

        // Calculate number of entries in the course
        Long entryCount = entryRepository.countByRootCourse_Id (courseId);

        // for each user calculate number of entryHistory items for that course
        List<HistoryEntriesPerUser> entryCountByUserForCourse = entryHistoryRepository.getEntryCountByUserForCourse (courseId);

        CourseStatisticsOutDto outDto = new CourseStatisticsOutDto (courseId);

        outDto.courseId = courseId;
        outDto.entryCount = entryCount;

        outDto.historyEntriesPerUsers.addAll (entryCountByUserForCourse);

        return outDto;
    }

/*    @CrossOrigin
    @RequestMapping(method = RequestMethod.GET, path = "courseHistory/{courseId}/users/{userId}")
    @Transactional
    public UserStatisticsOutDto getUserStatistics (@PathVariable Long courseId, @PathVariable Long userId) {

        if (courseId == null || userId == null) {
            return null;
        }

        UserStatisticsOutDto outDto = new UserStatisticsOutDto ();



        return outDto;
    }*/
}
