angular.module ('myapp.factories.entrydata', [])

    .factory ('EntryData', [function ()
    {
        "use strict";

        /**
         * The data object that is referenced by each tree entry.
         *
         * @author Sebastian Geiger
         *
         * @param id
         * @param type
         * @constructor
         */
        function EntryData (id, type)
        {
            if (id === null)
                this.id = EntryData.get_next_id ();
            else
                this.id = id;
            this.type = type;
            this.container = null;
        }

        EntryData.get_next_id = (function ()
        {
            var id = 0;

            return function ()
            {
                return id++;
            };
        }) ();

        EntryData.prototype.get_container = function ()
        {
            return this.container;
        };

        return EntryData;
    }]);
