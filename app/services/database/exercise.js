angular.module ('myapp.factories.exercise', ['myapp.factories.entry', 'myapp.factories.entrydata'])

    .factory ('Exercise', ['Entry', 'EntryData', '$log', function (Entry, EntryData, $log)
    {
        function Exercise (exercise_type)
        {
            EntryData.call (this, null, 'exercise');
            this.exercise_type = exercise_type;
            this.correct = null;
            this.incorrect = null;
        }

        Exercise.prototype = Object.create (EntryData.prototype);
        Exercise.prototype.constructor = Exercise;

        function insert (entrydata, correct)
        {
            if (!this.container)
            {
                throw new Error ("Exercise is not inside a container. You must first insert this exercise into another entry.");
            }

            var entry = new Entry (null, entrydata);

            if (correct)
                this.correct = entry;
            else
                this.incorrect = entry;

            entry.parent = this.container;
            entry.index = 0;
            entry.course_id = this.container.course_id;
            entry.depth = this.container.depth + 1;
        }

        Exercise.prototype.insert_correct = function (entrydata)
        {
            insert.call (this, entrydata, true);
        };

        Exercise.prototype.insert_incorrect = function (entrydata)
        {
            insert.call (this, entrydata, false);
        };

        return Exercise;
    }])

    .factory ('YesNoExercise', ['EntryData', 'Exercise', '$log', function (EntryData, Exercise, $log)
    {
        function YesNoExercise (title, text, answer, blocks, prev)
        {
            if (prev && !(prev instanceof EntryData))
            {
                throw new Error ("[YesNoExercise] The prev object must be an instance of EntryData.");
            }

            Exercise.call (this, 'yesnoexercise');
            this.title = title;
            this.text = text;
            this.answer = answer;
            this.blocks = blocks;
            if (typeof prev !== "undefined" && prev) {
                prev.next = this;
            }
            this.next = null;
        }

        YesNoExercise.prototype = Object.create(Exercise.prototype);
        YesNoExercise.prototype.constructor = YesNoExercise;

        YesNoExercise.prototype.toString = function (prefix)
        {
            return "[YesNoExercise]";
        };

        return YesNoExercise;
    }])

    .factory ('MultiAnswerExercise', ['EntryData', 'Exercise', '$log', function (EntryData, Exercise, $log)
    {
        "use strict";

        /**
         *
         * @param title
         * @param text
         * @param answer_candidates
         * @param blocks
         * @param prev
         * @constructor
         */
        function MultiAnswerExercise (title, text, answer_candidates, blocks, prev)
        {
            if (prev && !(prev instanceof EntryData))
            {
                throw new Error ("[YesNoExercise] The prev object must be an instance of EntryData.");
            }

            Exercise.call (this, 'multianswerexercise');
            this.title = title;
            this.text = text;
            this.answer_candidates = answer_candidates;
            this.blocks = blocks;
            if (typeof prev !== "undefined" && prev) {
                prev.next = this;
            }
            this.next = null;
        }

        MultiAnswerExercise.prototype = Object.create(Exercise.prototype);
        MultiAnswerExercise.prototype.constructor = MultiAnswerExercise;

        MultiAnswerExercise.prototype.toString = function (prefix)
        {
            return "[MultiAnswerExercise";
        };

        return MultiAnswerExercise;
    }]);
