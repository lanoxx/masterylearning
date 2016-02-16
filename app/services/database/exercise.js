angular.module ('myapp.factories.exercise', ['myapp.factories.entrydata'])

    .factory ('YesNoExercise', ['$log', 'EntryData', function ($log, EntryData)
    {
        function YesNoExercise (title, text, answer, blocks, prev)
        {
            EntryData.call (this, null, 'yesnoexercise');
            this.title = title;
            this.text = text;
            this.answer = answer;
            this.blocks = blocks;
            if (typeof prev !== "undefined" && prev) {
                prev.next = this;
            }
            this.next = null;
        }

        YesNoExercise.prototype = Object.create(EntryData.prototype);
        YesNoExercise.prototype.constructor = YesNoExercise;

        YesNoExercise.prototype.toString = function (prefix)
        {
            return "[YesNoExercise]";
        };

        return YesNoExercise;
    }])

    .factory ('MultiAnswerExercise', ['$log', 'EntryData', function ($log, EntryData)
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
            EntryData.call (this, null, 'multianswerexercise');
            this.title = title;
            this.text = text;
            this.answer_candidates = answer_candidates;
            this.blocks = blocks;
            if (typeof prev !== "undefined" && prev) {
                prev.next = this;
            }
            this.next = null;
        }

        MultiAnswerExercise.prototype = Object.create(EntryData.prototype);
        MultiAnswerExercise.prototype.constructor = MultiAnswerExercise;

        MultiAnswerExercise.prototype.toString = function (prefix)
        {
            return "[MultiAnswerExercise";
        };

        return MultiAnswerExercise;
    }]);
