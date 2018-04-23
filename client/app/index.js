require('angular/angular.js');

require('./teacher/statistics/course-statistics.html');
require('./teacher/edit/edit-course.html');
require('./teacher/teacher-home.html');
require('./admin/admin-home.html');
require('./admin/add-multiple-users/add-multiple-users.tpl.html');
require('./admin/delete-user/delete-user.tpl.html');
require('./admin/edit-user/edit-user.tpl.html');
require('./admin/add-user/add-user.tpl.html');
require('./navigation.html');
require('./app.html');
require('./student/student-home.html');
require('./student/courses/courses.html');
require('./student/courses/entries/structure/structure.html');
require('./student/courses/entries/flow/flow.html');
require('./student/courses/entries/exercises/my-app-yesnoexercise.tpl.html');
require('./student/courses/entries/exercises/exercises.html');
require('./student/courses/entries/exercises/my-app-multianswerexercise.tpl.html');
require('./student/courses/entries/entries.html');
require('./about.html');
require('./footer.html');
require('./user/profile/profile.html');
require('./user/passwordReset.html');
require('./components/header/header.html');
require('./components/password/password.html');

require('d3/d3.js');
require('lodash/lodash.js');

require('angular-resource/angular-resource.js');
require('angular-sanitize/angular-sanitize.js');
require('angular-cookies/angular-cookies.js');
require('@uirouter/angularjs');
require('angular-ui-bootstrap/dist/ui-bootstrap-tpls.js');
require('angular-katex/angular-katex.js');
require('angular-base64/angular-base64.js');
require('./services/roleservice.js');
require('./services/http-interceptor.js');
require('./services/user-service.js');
require('./services/contentservice.js');
require('./services/d3service.js');
require('./services/course-service.js');
require('./services/statistic-service.js');
require('./services/history-service.js');
require('./services/databaseservice.js');
require('./services/database/paragraph.js');
require('./services/database/entrydata.js');
require('./services/database/unit.js');
require('./services/database/continue-button.js');
require('./services/database/entry.js');
require('./services/database/course.js');
require('./services/database/exercise.js');
require('./services/database/section.js');
require('./components/config/config.js');
require('./components/version/version-directive.js');
require('./components/version/version.js');
require('./components/version/interpolate-filter.js');
require('./components/header/header.js');
require('./components/password/password.js');
require('./components/mathmode/mathmode.js');
require('./app.js');
require('./navigation.js');
require('./teacher/statistics/course-histogram.js');
require('./teacher/statistics/course-statistics.js');
require('./teacher/teacher-home.js');
require('./teacher/edit/edit-course.js');
require('./admin/admin-home.js');
require('./admin/add-multiple-users/add-multiple-users.js');
require('./admin/delete-user/delete-user.js');
require('./admin/edit-user/edit-user.js');
require('./admin/add-user/add-user.js');
require('./config.js');
require('./footer.js');
require('./student/courses/courses.js');
require('./student/courses/entries/structure/structure.js');
require('./student/courses/entries/flow/flow.js');
require('./student/courses/entries/entries.js');
require('./student/courses/entries/exercises/exercises.js');
require('./student/courses/entries/exercises/my-app-multianswerexercise.js');
require('./student/courses/entries/exercises/my-app-yesnoexercise.js');
require('./student/student-home.js');
require('./user/user.js');
require('./user/profile/profile.js');

/**
 * The following section includes scripts loaded via the script-loader plugin
 * of webpack. The scripts from Andreas Holzer are currently not modularized
 * and therefore need to be imported into global scope. These scripts depend
 * on the vis library. If we import the vis library with 'require()' then
 * it will be ordered wrongly after the other scripts, so we also need to
 * include it through the script loader.
 */
require('script-loader!vis/dist/vis.js');
require('script-loader!js-utils/src/html.js');
require('script-loader!js-utils/src/katex.js');

require('script-loader!elearning-content-fmi/src/algorithm_animation.js');
require('script-loader!elearning-content-fmi/src/illustrations.js');
require('script-loader!elearning-content-fmi/src/utils/ctl.js');
require('script-loader!elearning-content-fmi/src/utils/ctl_star.js');
require('script-loader!elearning-content-fmi/src/utils/kripke.js');
require('script-loader!elearning-content-fmi/src/utils/mathembler.js');
require('script-loader!elearning-content-fmi/src/utils/set.js');
