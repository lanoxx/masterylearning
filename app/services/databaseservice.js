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
            Object.keys(this.courses).forEach(function (key)
            {
                var course = this.courses[key];
                entries.push.apply(entries, collect(course.entries, type));
            }, this);

            function collect(entries, type)
            {
                var result = [];

                if (!entries || entries.length === 0)
                    return [];

                entries.forEach(function (entry)
                {
                    if (!type)
                        result.push(entry);
                    else if (type && entry.data.type === type)
                        result.push(entry);

                    if (entry.hasOwnProperty("children")) {
                        result.push.apply(result, collect(entry.children, type));
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

        var section = course.insert (new Section("Preliminaries: Propositional Logic", "A short description of propositional logic"));

        var subsection = section.insert (new Section("Syntax", "Subsection 1 Description"));

        var unit = subsection.insert (new Unit("Unit 1", "Unit 1", "Unit 1 description", null));

        var paragraph = unit.insert (new Paragraph("text", "Lorem ipsum dolor sit amet, consectetur adipisicing elit. A accusamus aliquam dolore harum iusto maiores maxime, minus modi molestiae, natus nisi non obcaecati porro quis quos reprehenderit repudiandae tempore temporibus!"));

        paragraph = unit.insert (new Paragraph("definition", "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores aspernatur atque libero magnam maiores perspiciatis quibusdam, repellat sapiente sunt tempora? Aperiam assumenda dolor ducimus eos officia quisquam rerum sapiente voluptatibus.",
            'text', 1, "Syntax"));

        paragraph = unit.insert (new Paragraph("definition", "Atomic propositions are symbols \\(a\\), \\(b\\), \\(c\\), ..., which can either have the value true or false.",
            'math', 2, "Propositions"));

        paragraph = unit.insert (new Paragraph("definition", "A formula G is a subformula ... if ... \\( sub(\\top) = {\\top} \\)",
            'math', 3, "Propositions"));

        var unit_section = unit.insert (new Section("Parentheses", "Explains handling of parantheses in logical formulas."));

        var exercise = unit.insert (new YesNoExercise("Evaluate Syntax", "Is \\((P \\wedge Q)\\) a subformula of the formula \\((R \\vee (P \\wedge Q))\\)?", true, true, null));

        exercise = unit.insert (new YesNoExercise("Evaluate Syntax", "Is \\((Q \\wedge P)\\) a subformula of the formula \\((R \\vee (P \\wedge Q))\\)?", false, true, exercise.data));

        exercise = unit.insert (new YesNoExercise ("Evaluate Semantics", "Given the following variable assignments: <ul><li>\\(a \\rightarrow 0\\)</li><li>\\(b \\rightarrow 1\\)</li><li>\\(c \\rightarrow 1\\)</li><li>\\(d \\rightarrow 1\\)</li></ul>Please specify the result for the following logical formula: <strong>\\((a \\land b) \\lor (c \\oplus D) \\)</strong>", true, true, exercise.data));

        exercise = unit.insert (new MultiAnswerExercise("Multiple Answers", "Which of the following answeres is syntactically right:",
            [
                { text: "\\(Q \\wedge P\\)", key: true },
                { text: "\\(Q \\wedge \\wedge P\\)", key: false },
                { text: "\\(\\wedge P\\)", key: false },
                { text: "\\((Q \\wedge P)\\)", key: true }
            ],
            true,
            exercise));

        var unit2 = subsection.insert(new Unit("Unit 2", "Unit 2", "Unit 2 description", unit.data));

        subsection = section.insert(new Section("Semantic", "Subsection 2 Description"));

        unit = subsection.insert(new Unit("Unit 1", "Unit 1", "Unit 1 description", null));

        unit2 = subsection.insert(new Unit("Unit 2", "Unit 2", "Unit 2 description", unit.data));

        subsection = section.insert(new Section("Subsection 3", "Subsection 3 Description"));

        unit = subsection.insert(new Unit("Unit 1", "Unit 1", "Unit 1 description", null));

        unit2 = subsection.insert(new Unit("Unit 2", "Unit 2", "Unit 2 description", unit.data));

        unit = section.insert(new Unit("Unit 1: Propositional Logic Formulas", "Unit 1", "Unit 1 description", null));

        unit2 = section.insert(new Unit("Unit 2: Propositional Logic Formulas", "Unit 1", "Unit 1 description", unit.data));

        section = course.insert(new Section("Section 2", "Section 2 Description"));

        subsection = section.insert(new Section("Subsection 1", "Subsection 1 Description"));

        subsection = section.insert(new Section("Subsection 2", "Subsection 2 Description"));

        section = course.insert(new Section("Section 3", "Section 3 Description"));

        subsection = section.insert(new Section("Subsection 1", "Subsection 1 Description"));

        unit = subsection.insert(new Unit("Unit 1", "Unit 1", "Unit 1 description", null));

        unit = subsection.insert(new Unit("Unit 2", "Unit 2", "Unit 2 description", null));

        subsection = section.insert(new Section("Subsection 2", "Subsection 2 Description"));

        unit = subsection.insert(new Unit("Unit 1", "Unit 1", "Unit 1 description", null));

        unit = subsection.insert(new Unit("Unit 2", "Unit 2", "Unit 2 description", null));

        $log.debug(database.courses['fmi'].print());

        return database;
    }]);
