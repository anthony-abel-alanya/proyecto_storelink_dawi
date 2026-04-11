package com.proyecto.shop.StoreLink.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import com.proyecto.shop.StoreLink.Model.UserInfo;
import com.proyecto.shop.StoreLink.Repository.IUserInfoRepository;

import java.util.Optional;

@Service
public class UserInfoUserDetailsServiceImpl implements UserDetailsService {
//UserDetailsService is from spring security not mine
    @Autowired
    private IUserInfoRepository userInfoDao;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<UserInfo> userInfo = userInfoDao.findByEmail(email);
        // Return-type UserDetails is in-built in spring security core (see imports on top)
        
        return userInfo
            .map(user-> new UserInfoUserDetails(
                user.getEmail(),
                user.getPassword(),
                user.getAllRoles()
            ))
            .orElseThrow(() -> new UsernameNotFoundException(email + " not found"));
    }

}
