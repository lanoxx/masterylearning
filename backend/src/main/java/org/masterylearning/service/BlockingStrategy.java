package org.masterylearning.service;

import org.masterylearning.domain.Entry;

public interface BlockingStrategy {

    boolean blocks (Entry entry);
}
