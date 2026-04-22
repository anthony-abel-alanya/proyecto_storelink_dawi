package com.proyecto.shop.StoreLink.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.proyecto.shop.StoreLink.Model.UserInfo;

import java.util.List;
import java.util.Optional;

@Repository
public interface IUserInfoRepository extends JpaRepository<UserInfo, Integer> {
	// Use email instead of username because it's a grocery app 
	// I decided we don't need usernames for this website
    Optional<UserInfo> findByEmail(String email); 
    
    // Buscar usuarios que NO son admin (solo customers)
    @Query("SELECT u FROM UserInfo u JOIN u.allRoles r WHERE r.roleName <> 'ADMIN'")
    List<UserInfo> findAllCustomers();
    
    // Buscar usuario por email y verificar que no sea admin (solo customers)
    @Query("SELECT DISTINCT u FROM UserInfo u JOIN u.allRoles r WHERE u.email = :email AND r.roleName <> 'ADMIN'")
    Optional<UserInfo> findCustomerByEmail(String email);
}