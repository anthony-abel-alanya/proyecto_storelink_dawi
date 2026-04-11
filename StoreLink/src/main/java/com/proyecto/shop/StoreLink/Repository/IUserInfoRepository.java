package com.proyecto.shop.StoreLink.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.proyecto.shop.StoreLink.Model.UserInfo;

import java.util.Optional;

@Repository
public interface IUserInfoRepository extends JpaRepository<UserInfo, Integer> {
	// Use email instead of username because it's a grocery app 
	// I decided we don't need usernames for this website
    Optional<UserInfo> findByEmail(String email); 
}