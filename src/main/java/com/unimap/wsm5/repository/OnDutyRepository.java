package com.unimap.wsm5.repository;

import com.unimap.wsm5.domain.OnDuty;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the OnDuty entity.
 */
@Repository
public interface OnDutyRepository extends JpaRepository<OnDuty, Long> {
    default Optional<OnDuty> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<OnDuty> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<OnDuty> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct onDuty from OnDuty onDuty left join fetch onDuty.staff left join fetch onDuty.transport",
        countQuery = "select count(distinct onDuty) from OnDuty onDuty"
    )
    Page<OnDuty> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct onDuty from OnDuty onDuty left join fetch onDuty.staff left join fetch onDuty.transport")
    List<OnDuty> findAllWithToOneRelationships();

    @Query("select onDuty from OnDuty onDuty left join fetch onDuty.staff left join fetch onDuty.transport where onDuty.id =:id")
    Optional<OnDuty> findOneWithToOneRelationships(@Param("id") Long id);
}
