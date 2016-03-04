angular.module ('myapp.services.content', [])

    .factory ('ContentService', ['$log', function ($log)
    {
        function ContentService (root, blocking_strategy, filter_strategy)
        {
            this.entry_stack = [root];
            this.blocking_strategy = blocking_strategy;
            this.filter_strategy = filter_strategy;
            this.exercise_tree = false;
        }

        ContentService.prototype.push = function (root)
        {
            this.entry_stack.push (root);
        };

        ContentService.prototype.set_exercise_tree = function ()
        {
            this.exercise_tree = true;
        };

        ContentService.prototype.enumerate_tree = function ()
        {
            var entries = [];
            var current_entry;

            current_entry = this.entry_stack.pop();
            entries.push(current_entry);

            if (this.blocking_strategy (current_entry))
            {
                var next = current_entry.next ();
                if (next)
                    this.entry_stack.push(next);
                return entries;
            }

            while ((current_entry = current_entry.next ()))
            {
                entries.push (current_entry);

                if (this.blocking_strategy (current_entry))
                {
                    next = current_entry.next ();
                    if (next)
                        this.entry_stack.push(next);
                    return entries;
                }
            }

            return entries;
        };

        ContentService.prototype.enumerate_subtree = function ()
        {
            var entries = [];
            var push = function push (current_entry) {
                if (this.filter_strategy (current_entry) || this.exercise_tree)
                    entries.push (current_entry);
            }.bind (this);

            var current_entry;

            current_entry = this.entry_stack.pop();
            push (current_entry);

            if (current_entry.has_children())
            {
                current_entry = current_entry.children[0];
            } else {
                if (current_entry.has_next_sibling())
                    this.entry_stack.push (current_entry.next_sibling ());
                return entries;
            }

            while (current_entry || this.entry_stack.length > 0)
            {
                push (current_entry);

                if (this.blocking_strategy (current_entry))
                {
                    if (current_entry.has_next_sibling())
                        this.entry_stack.push(current_entry.next_sibling());
                    return entries;
                }

                if (current_entry.has_children())
                {
                    if (current_entry.has_next_sibling())
                        this.entry_stack.push (current_entry.next_sibling());
                    current_entry = current_entry.children[0];
                } else {
                    current_entry = current_entry.next_sibling();
                    if (!current_entry) {
                        current_entry = this.entry_stack.pop ();
                        this.exercise_tree = false;
                    }
                }
            }

            return entries;
        };

        return ContentService;
    }]);
