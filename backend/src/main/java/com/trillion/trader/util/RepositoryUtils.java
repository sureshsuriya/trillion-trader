package com.trillion.trader.util;

import com.trillion.trader.exception.ResourceNotFoundException;
import org.springframework.data.repository.CrudRepository;

public final class RepositoryUtils {

    private RepositoryUtils() {
        // Utility class
    }

    public static <T, ID> T findOrThrow(CrudRepository<T, ID> repository, ID id, String entityName) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(entityName + " not found with id: " + id));
    }
}
