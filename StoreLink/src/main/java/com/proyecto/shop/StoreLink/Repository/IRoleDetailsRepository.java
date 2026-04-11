package com.proyecto.shop.StoreLink.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.proyecto.shop.StoreLink.Model.RoleDetails;



@Repository
public interface IRoleDetailsRepository extends JpaRepository<RoleDetails, Integer> {
    Optional<RoleDetails> findByRoleName(String roleName);
}