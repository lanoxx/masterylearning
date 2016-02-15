angular.module ('myapp.factories.exercise', ['myapp.factories.entry'])

    .factory ('YesNoExercise', ['$log', 'Entry', function ($log, Entry)
    {
        function YesNoExercise (title, text, answer, blocks, prev)
        {
            Entry.call (this, 'yesnoexercise');
            this.title = title;
            this.text = text;
            this.answer = answer;
            this.blocks = blocks;
            if (typeof prev !== "undefined" && prev) {
                prev.next = this;
            }
            this.next = null;
        }

        YesNoExercise.prototype = Object.create(Entry.prototype);
        YesNoExercise.prototype.constructor = YesNoExercise;

        return YesNoExercise;
    }])

    .factory ('MultiAnswerExercise', ['$log', 'Entry', function ($log, Entry)
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
            Entry.call (this, 'multianswerexercise');
            this.title = title;
            this.text = text;
            this.answer_candidates = answer_candidates;
            this.blocks = blocks;
            if (typeof prev !== "undefined" && prev) {
                prev.next = this;
            }
            this.next = null;
        }

        MultiAnswerExercise.prototype = Object.create(Entry.prototype);
        MultiAnswerExercise.prototype.constructor = MultiAnswerExercise;

        return MultiAnswerExercise;
    }]);
