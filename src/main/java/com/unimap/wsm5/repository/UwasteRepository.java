package com.unimap.wsm5.repository;

import com.unimap.wsm5.domain.Uwaste;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Uwaste entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UwasteRepository extends JpaRepository<Uwaste, Long> {}
