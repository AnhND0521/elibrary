package vdt.se.nda.elibrary.repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vdt.se.nda.elibrary.domain.User;

/**
 * Spring Data JPA repository for the {@link User} entity.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    String USERS_BY_LOGIN_CACHE = "usersByLogin";

    String USERS_BY_EMAIL_CACHE = "usersByEmail";

    Optional<User> findOneByActivationKey(String activationKey);

    List<User> findAllByActivatedIsFalseAndActivationKeyIsNotNullAndCreatedDateBefore(Instant dateTime);

    Optional<User> findOneByResetKey(String resetKey);

    Optional<User> findOneByEmailIgnoreCase(String email);

    Optional<User> findOneByLogin(String login);

    @EntityGraph(attributePaths = "authorities")
    @Cacheable(cacheNames = USERS_BY_LOGIN_CACHE)
    Optional<User> findOneWithAuthoritiesByLogin(String login);

    @EntityGraph(attributePaths = "authorities")
    @Cacheable(cacheNames = USERS_BY_EMAIL_CACHE)
    Optional<User> findOneWithAuthoritiesByEmailIgnoreCase(String email);

    Page<User> findAllByIdNotNullAndActivatedIsTrue(Pageable pageable);

    @Override
    @Caching(
        evict = {
            @CacheEvict(value = USERS_BY_LOGIN_CACHE, key = "#p0 != null ? #p0.login : null"),
            @CacheEvict(value = USERS_BY_EMAIL_CACHE, key = "#p0 != null ? #p0.email : null"),
        }
    )
    <S extends User> S save(S entity);

    @Override
    @Caching(
        evict = {
            @CacheEvict(value = USERS_BY_LOGIN_CACHE, key = "#p0 != null ? #p0.login : null"),
            @CacheEvict(value = USERS_BY_EMAIL_CACHE, key = "#p0 != null ? #p0.email : null"),
        }
    )
    default <S extends User> S saveAndFlush(S entity) {
        return null;
    }
}
