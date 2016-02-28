angular.module ('myapp.factories.entry', [])

    .factory ('Entry', ['$log', function ($log)
    {
        "use strict";

        /**
         * Entry represents a tree structure that holds the object which make up a course. The entry itself only models
         * the tree structure. Access the trees elements through the `data` property.
         *
         * @author Sebastian Geiger
         *
         * @param id
         * @param data
         * @constructor
         */
        function Entry (id, data)
        {
            if (id === null)
                this.id = Entry.get_next_id ();
            else
                this.id = id;
            this.index = -1;
            this.depth = 0;
            this.course_id = null;
            this.data = data;
            this.parent = null;
            this.children = [];
        }

        Entry.get_next_id = (function ()
        {
            var id = 0;

            return function ()
            {
                return id++;
            };
        }) ();

        Entry.prototype.insert = function (entrydata)
        {
            var entry = new Entry (null, entrydata);
            this.children.push (entry);

            entry.index = this.children.length - 1;
            entry.course_id = this.id;
            entry.depth = this.depth + 1;
            entry.parent = this;

            entrydata.container = entry;

            return entry;
        };

        Entry.prototype.next_sibling = function ()
        {
            if (this.parent)
            {
                if (this.parent.children.length > this.index + 1)
                    return this.parent.children[this.index + 1];
                else
                    return this.parent.next_sibling ();
            }

            return null;
        };

        Entry.prototype.prev_sibling = function ()
        {
            if (parent)
            {
                if (this.index > 0)
                    return parent.children[this.index - 1];
                else
                    return parent.prev_sibling ();
            }

            return null;
        };

        Entry.prototype.next = function ()
        {
            if (this.children.length > 0)
                return this.children[0];
            else
                return this.next_sibling();
        };

        Entry.prototype.prev = function ()
        {
            if (this.index > 0)
                return this.prev_sibling ();
            else
                return this.parent;
        };

        Entry.prototype.getIndex = function ()
        {
            var index;

            index = this.index !== -1 ?  this.index + 1 : "";

            if (this.parent === null)
                return index;


            return this.parent.getIndex() + "." + index;
        };

        Entry.prototype.toString = function (prefix)
        {
            var child_strings = "";
            var result;

            this.children.forEach (function (child, i)
            {
                if (i > 0)
                    child_strings += ",\n";
                child_strings += child.toString(prefix + "           ");
            }, this);

            result = prefix + "Entry (id=" + this.id + ", index=" + this.index + "\n" +
                     prefix + "       data=" + this.data.toString(prefix) + "\n";

            if (child_strings) {
                result += prefix + "       children=[\n";
                result += child_strings + "]\n";
            } else {
                result += prefix + "       children=[];\n";
            }
            result += prefix + ")";

            return result;
        };

        $log.debug ('[myApp.factories] Entry function loaded');

        return Entry;
    }]);
