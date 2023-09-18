package com.mary.rest.services;

import com.mary.rest.models.User;
import org.springframework.security.core.userdetails.UserDetailsService;


import java.util.List;

public interface UserService extends UserDetailsService {


    List<User> getListUsers();

    boolean saveUser(User user);

    void updateUser(long id, User user);

    void removeUserById(long id);

  //  UserDetails loadUserByUsername(String username);
}
