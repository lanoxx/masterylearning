package org.masterylearning.domain;

/**
 * The Child interface is implemented by all children that can be contained in a container such
 * as a Course or an Entry.
 *
 * It provides methods to traverse the
 */
public interface Child<T extends Container<T>> {

    /**
     * @return The parent container of this child
     */
    Container<T> getParent();

    /**
     * A convenience method to avoid casting
     * @return Returns the this object but by its actual type.
     */
    T getInstance();
}
