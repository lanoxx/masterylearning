/**
 * &copy 2016
 *
 * This database module stores and loads the course structure. Currently its non-persistent, later I will interface
 * this object with the backend.
 *
 * @author: Sebastian Geiger
 */
angular.module('myapp.services.database', [])

    .factory('database', ['$log', function ($log)
    {
        var database;

        /* --- START COURSE --- */
        function Course(id, title, period, description)
        {
            this.id = id;
            this.title = title;
            this.period = period;
            this.description = description;
            this.entries = [];
        }

        Course.prototype.add_entry = function (entry)
        {
            this.entries.push(entry);
            entry.course_id = this.id;
        };

        Course.prototype.print = function ()
        {
            var result = "[myApp] Course (id=" + this.id + ", title=" + this.title + ", period=" + this.period + ", description=" + this.description;

            result += ", entries=[\n";

            this.entries.forEach(function (entry)
            {
                result += "\t" + entry.toString("\t") + "\n"
            });

            result += "])";

            $log.info(result);
        };

        var get_next_id = (function ()
        {
            var id = 0;

            return function ()
            {
                return id++;
            };
        })();
        /* --- END COURSE --- */

        /* --- START ENTRY --- */
        function Entry(type)
        {
            this.id = get_next_id();
            this.type = type;
            this.course_id = null;
        }

        Entry.prototype.toString = function ()
        {
            return "Entry (id=" + this.id + ", type=" + this.type + ", course_id=" + this.course_id + ")";
        };
        /* --- END ENTRY --- */

        /* -- START SECTION ---*/
        function Section(title, description)
        {
            Entry.call(this, 'section');
            this.title = title;
            this.description = description;
            this.entries = [];
            this.parent_entry_id = null;
        }

        Section.prototype = Object.create(Entry.prototype);
        Section.prototype.constructor = Section;

        Section.prototype.add_entry = function (entry)
        {
            if (this.course_id === null)
                throw new Error("Section " + this.id + " not yet added to a course.");

            this.entries.push(entry);
            entry.course_id = this.course_id;
            entry.parent_entry_id = this.id;

            return this;
        };

        Section.prototype.toString = function (prefix)
        {
            var result = "Section (id=" + this.id + ", type=" + this.type + ", title=" + this.title + ", description=" + this.description + ", course_id=" + this.course_id + ", entries=[\n";

            this.entries.forEach(function (entry)
            {
                result += prefix + "\t" + entry.toString(prefix + "\t") + "\n";
            });

            result += prefix + "])";
            return result;
        };
        /* --- END SECTION --- */

        /* --- START UNIT --- */
        function Unit(full_title, breadcrumb_title, description, prev)
        {
            Entry.call(this, 'unit');
            this.full_title = full_title;
            this.breadcrumb_title = breadcrumb_title;
            this.description = description;

            if (prev != null) {
                this.prev = prev.id;
                prev.next = this.id;
            } else {
                this.prev = null;
            }

            this.next = null;
            this.entries = [];
        }

        Unit.prototype = Object.create(Entry.prototype);
        Unit.prototype.constructor = Unit;

        Unit.prototype.add_entry = function (entry)
        {
            if (this.course_id === null)
                throw new Error("Unit " + this.id + " not yet added to a course.");

            this.entries.push(entry);
            entry.course_id = this.course_id;
            entry.parent_entry_id = this.id;

            return this;
        };

        Unit.prototype.toString = function (prefix)
        {
            var result = "Unit (id=" + this.id + ", type=" + this.type + ", full_title=" + this.full_title + ", breadcrumb_title=" + this.breadcrumb_title + ", description=" + this.description;

            var prev_id = this.prev ? this.prev.id : "null";
            var next_id = this.next ? this.next.id : "null";

            result += ", prev=" + prev_id + ", next=" + next_id + ", course_id=" + this.course_id + ", entries=[\n";

            this.entries.forEach(function (entry)
            {
                result += prefix + "\t" + entry.toString(prefix + "\t") + "\n";
            });

            result += prefix + "])";
            return result;
        };
        /* --- END UNIT --- */

        /* --- START PARAGRAPH --- */
        function Paragraph(paragraph_type, text, mode, number, title)
        {
            Entry.call(this, 'paragraph');
            this.text = text;
            this.number = number;
            this.title = title;
            this.paragraph_type = paragraph_type;
            this.mode = mode;
        }

        /* --- END PARAGRAPH --- */

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
