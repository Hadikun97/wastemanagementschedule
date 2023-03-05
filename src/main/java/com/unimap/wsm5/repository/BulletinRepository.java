package com.unimap.wsm5.repository;

import com.unimap.wsm5.domain.Bulletin;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Bulletin entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BulletinRepository extends JpaRepository<Bulletin, Long> {}
