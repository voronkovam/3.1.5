package com.mary.rest.repositories;

import com.mary.rest.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    @Query("select u from User u left join fetch u.roles where u.email =:email")
    User findUserByEmail(@Param("email") String email);

    @Query("select distinct u from User u left join fetch u.roles")
    List<User> findAll();

}
