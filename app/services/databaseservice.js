/**
 * &copy 2016
 *
 * This database module stores and loads the course structure. Currently its non-persistent, later I will interface
 * this object with the backend.
 *
 * @author Sebastian Geiger
 */
angular.module('myapp.services.database', [
        'myapp.factories.course',
        'myapp.factories.entry',
        'myapp.factories.section',
        'myapp.factories.unit',
        'myapp.factories.paragraph',
        'myapp.factories.exercise'])

    .factory('database', ['$log', 'Course', 'Entry', 'Section', 'Unit', 'Paragraph', 'YesNoExercise', 'MultiAnswerExercise',
        function ($log, Course, Entry, Section, Unit, Paragraph, YesNoExercise, MultiAnswerExercise)
    {
        var database;

        /* --- START DATABASE --- */
        function Database()
        {
            this.courses = {};
        }

        Database.prototype.insert_course = function (course)
        {
            this.courses[course.id] = course;
        };

        Database.prototype.get_entries = function (type)
        {
            var entries = [];
            var that = this;
            Object.keys(this.courses).forEach(function (key)
            {
                var course = that.courses[key];
                entries.push.apply(entries, collect(course.entries, type));
            });

            function collect(entries, type)
            {
                var result = [];

                if (!entries || entries.length === 0)
                    return [];

                entries.forEach(function (entry)
                {
                    if (!type)
                        result.push(entry);
                    else if (type && entry.type === type)
                        result.push(entry);

                    if (entry.hasOwnProperty("entries")) {
                        result.push.apply(result, collect(entry.entries, type));
                    }
                });
                return result;
            }

            return entries;
        };
        /* --- END DATABASE --- */

        /* DATABASE Setup: */
        Database.prototype.Course = Course;
        Database.prototype.Section = Section;
        Database.prototype.Unit = Unit;

        database = new Database();

        var course = new Course("fmi", "Formal Methods in Computer Science", "(SS'16)", "A short description of the lecture's content");
        database.insert_course(course);

        var section = new Section("Preliminaries: Propositional Logic", "A short description of propositional logic");
        course.add_entry(section);

        var subsection = new Section("Syntax", "Subsection 1 Description");
        section.add_entry(subsection);

        var unit = new Unit("Unit 1", "Unit 1", "Unit 1 description", null);
        subsection.add_entry(unit);

        var paragraph = new Paragraph("text", "Lorem ipsum dolor sit amet, consectetur adipisicing elit. A accusamus aliquam dolore harum iusto maiores maxime, minus modi molestiae, natus nisi non obcaecati porro quis quos reprehenderit repudiandae tempore temporibus!");
        unit.add_entry(paragraph);

        paragraph = new Paragraph("definition", "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores aspernatur atque libero magnam maiores perspiciatis quibusdam, repellat sapiente sunt tempora? Aperiam assumenda dolor ducimus eos officia quisquam rerum sapiente voluptatibus.",
            'text', 1, "Syntax");
        unit.add_entry(paragraph);

        paragraph = new Paragraph("definition", "Atomic propositions are symbols \\(a\\), \\(b\\), \\(c\\), ..., which can either have the value true or false.",
            'math', 2, "Propositions");
        unit.add_entry(paragraph);

        paragraph = new Paragraph("definition", "A formula G is a subformula ... if ... \\( sub(\\top) = {\\top} \\)",
            'math', 3, "Propositions");
        unit.add_entry(paragraph);

        var unit_section = new Section("Parentheses", "Explains handling of parantheses in logical formulas.");
        unit.add_entry(unit_section);

        var exercise = new YesNoExercise("Evaluate Syntax", "Is \\((P \\wedge Q)\\) a subformula of the formula \\((R \\vee (P \\wedge Q))\\)?", true, true, null);
        unit.add_entry (exercise);

        exercise = new YesNoExercise("Evaluate Syntax", "Is \\((Q \\wedge P)\\) a subformula of the formula \\((R \\vee (P \\wedge Q))\\)?", false, true, exercise);
        unit.add_entry (exercise);

        exercise = new YesNoExercise ("Evaluate Semantics", "Given the following variable assignments: <ul><li>\\(a \\rightarrow 0\\)</li><li>\\(b \\rightarrow 1\\)</li><li>\\(c \\rightarrow 1\\)</li><li>\\(d \\rightarrow 1\\)</li></ul>Please specify the result for the following logical formula: <strong>\\((a \\land b) \\lor (c \\oplus D) \\)</strong>", true, true, exercise);
        unit.add_entry(exercise);

        exercise = new MultiAnswerExercise("Multiple Answers", "Which of the following answeres is syntactically right:",
                                           [
                                               { text: "\\(Q \\wedge P\\)", key: true },
                                               { text: "\\(Q \\wedge \\wedge P\\)", key: false },
                                               { text: "\\(\\wedge P\\)", key: false },
                                               { text: "\\((Q \\wedge P)\\)", key: true }
                                           ],
                                           true,
                                           exercise);
        unit.add_entry(exercise);

        var unit2 = new Unit("Unit 2", "Unit 2", "Unit 2 description", unit);
        subsection.add_entry(unit2);

        subsection = new Section("Semantic", "Subsection 2 Description");
        section.add_entry(subsection);

        unit = new Unit("Unit 1", "Unit 1", "Unit 1 description", null);
        subsection.add_entry(unit);

        unit2 = new Unit("Unit 2", "Unit 2", "Unit 2 description", unit);
        subsection.add_entry(unit2);

        subsection = new Section("Subsection 3", "Subsection 3 Description");
        section.add_entry(subsection);

        unit = new Unit("Unit 1", "Unit 1", "Unit 1 description", null);
        subsection.add_entry(unit);

        unit2 = new Unit("Unit 2", "Unit 2", "Unit 2 description", unit);
        subsection.add_entry(unit2);

        unit = new Unit("Unit 1: Propositional Logic Formulas", "Unit 1", "Unit 1 description", null);
        section.add_entry(unit);

        unit2 = new Unit("Unit 2: Propositional Logic Formulas", "Unit 1", "Unit 1 description", unit);
        section.add_entry(unit2);

        section = new Section("Section 2", "Section 2 Description");
        course.add_entry(section);

        subsection = new Section("Subsection 1", "Subsection 1 Description");
        section.add_entry(subsection);

        subsection = new Section("Subsection 2", "Subsection 2 Description");
        section.add_entry(subsection);

        section = new Section("Section 3", "Section 3 Description");
        course.add_entry(section);

        subsection = new Section("Subsection 1", "Subsection 1 Description");
        section.add_entry(subsection);

        unit = new Unit("Unit 1", "Unit 1", "Unit 1 description", null);
        subsection.add_entry(unit);

        unit = new Unit("Unit 2", "Unit 2", "Unit 2 description", null);
        subsection.add_entry(unit);

        subsection = new Section("Subsection 2", "Subsection 2 Description");
        section.add_entry(subsection);

        unit = new Unit("Unit 1", "Unit 1", "Unit 1 description", null);
        subsection.add_entry(unit);

        unit = new Unit("Unit 2", "Unit 2", "Unit 2 description", null);
        subsection.add_entry(unit);

        //$log.debug(database.courses['fmi'].print());

        return database;
    }]);
