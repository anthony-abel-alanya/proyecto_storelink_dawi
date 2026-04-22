package com.proyecto.shop.StoreLink.Service;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.proyecto.shop.StoreLink.Model.RoleDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class UserInfoUserDetails implements UserDetails {

    private String email;
    private String password;
    private List<SimpleGrantedAuthority> allRoles;
    private boolean enabled;

    public UserInfoUserDetails(String email, String password, List<RoleDetails> allRoles, boolean enabled) {
        super();
    	this.email = email;
        this.password = password;
        this.allRoles = allRoles.stream()
                .map(role -> new SimpleGrantedAuthority(role.getRoleName()))
                .collect(Collectors.toList());
        this.enabled = enabled;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return allRoles;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email; // Person's email will be used as their username
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    // Spring Security también necesita isAccountNonLocked() y isAccountNonExpired()
    @Override
    public boolean isAccountNonLocked() {
        return enabled;
    }

    @Override
    public boolean isAccountNonExpired() {
        return enabled;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return enabled;
    }

}

