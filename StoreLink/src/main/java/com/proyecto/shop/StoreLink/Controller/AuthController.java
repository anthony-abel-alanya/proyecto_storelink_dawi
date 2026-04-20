package com.proyecto.shop.StoreLink.Controller;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proyecto.shop.StoreLink.Dto.AuthResponse;
import com.proyecto.shop.StoreLink.Dto.LoginRequest;
import com.proyecto.shop.StoreLink.Model.UserInfo;
import com.proyecto.shop.StoreLink.Repository.IUserInfoRepository;
import com.proyecto.shop.StoreLink.Service.JwtService;


@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

	@Autowired
	IUserInfoRepository userInfoDao;
	
	@Autowired
	JwtService jwtService;

	@Autowired
	AuthenticationManager authenticationManager;

	@PostMapping
	public ResponseEntity<AuthResponse> validate(@RequestBody LoginRequest loginRequest) {
		logger.info("in authentication endpoint ....");
		try {
			Authentication authentication = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

			if (authentication.isAuthenticated()) {
				UserInfo userEntity = userInfoDao.findByEmail(loginRequest.getEmail()).get();
				
				// Extract roles (without exposing password)
				List<String> roles = userEntity.getAllRoles().stream()
						.map(role -> role.getRoleName())
						.collect(Collectors.toList());
				
				// Create AuthResponse (no password exposed)
				AuthResponse authResponse = new AuthResponse();
				authResponse.setToken(jwtService.generateToken(loginRequest.getEmail()));
				authResponse.setEmail(userEntity.getEmail());
				authResponse.setRoles(roles);
				
				return new ResponseEntity<>(authResponse, HttpStatus.OK);
			} else {
				throw new UsernameNotFoundException("Invalid user request !");
			}

		} catch (BadCredentialsException e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		} catch (UsernameNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}

	}
}