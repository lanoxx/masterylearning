angular.module ('myapp.factories.paragraph', ['myapp.factories.entry'])

    .factory ('Paragraph', ['$log', 'Entry', function ($log, Entry)
    {
        "use strict";

        /**
         * A paragraph represents either a regular text paragraph or a definition entity and is usually contained
         * in a unit, section, or other entries.
         *
         * @param paragraph_type
         * @param text
         * @param mode
         * @param number
         * @param title
         * @constructor
         */
        function Paragraph (paragraph_type, text, mode, number, title)
        {
            Entry.call (this, 'paragraph');
            this.text = text;
            this.number = number;
            this.title = title;
            this.paragraph_type = paragraph_type;
            this.mode = mode;
        }

        return Paragraph;
    }]);
