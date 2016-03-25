package org.masterylearning.domain;

import java.util.List;

/**
 */
public interface Container<T extends Container<T>> {

    List<T> getChildren ();

    /**
     * This method traverses the Container graph and returns the next object in the graph. It uses the following
     * precedence to retrieve the next element:
     *
     *  1. If the Container has children, return the first child.
     *  2. If it has no children, then return the immediate next sibling
     *  3. If there is no immediate next sibling, then return the next upwards element.
     *
     * @return The next entry in the graph or null if no next element exists.
     */
    T next();

    /**
     * @return The next item upwards in the tree
     */
    T nextUpwards ();

    /**
     * @return True if there is a next entry in the graph hierarchy, false otherwise.
     */
    boolean hasNext ();

    /**
     * @return The next immediate sibling of this graph hierarchy.
     */
    T nextSibling ();

    /**
     * @return True if there is a next immediate sibling in the graph hierarchy, false otherwise.
     */
    boolean hasNextSibling ();
}
