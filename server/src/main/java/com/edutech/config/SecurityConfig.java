package com.edutech.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.edutech.util.JwtRequestFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    private final UserDetailsService userDetailsService;
    private final JwtRequestFilter jwtRequestFilter;
    private final PasswordEncoder passwordEncoder;

    public SecurityConfig(UserDetailsService userDetailsService, JwtRequestFilter jwtRequestFilter,
            PasswordEncoder passwordEncoder) {
        this.userDetailsService = userDetailsService;
        this.jwtRequestFilter = jwtRequestFilter;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable()
                .authorizeRequests()
                .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .antMatchers(HttpMethod.POST, "/api/auth/register").permitAll()
                .antMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                .antMatchers(HttpMethod.POST, "/api/auth/send-otp").permitAll()
                .antMatchers(HttpMethod.POST, "/api/auth/verify-otp").permitAll()

                // Forget Password APIs
                .antMatchers(HttpMethod.POST, "/api/auth/forgot-password").permitAll()
                .antMatchers(HttpMethod.POST, "/api/auth/reset-password").permitAll()

                .antMatchers(HttpMethod.GET, "/api/auth/user/**").hasAnyAuthority("ADMIN", "MANAGER", "CUSTOMER")

                // Restaurant access
                .antMatchers(HttpMethod.GET, "/api/restaurants/**").hasAnyAuthority("ADMIN", "MANAGER", "CUSTOMER")
                .antMatchers(HttpMethod.POST, "/api/restaurants/assignmanager").hasAnyAuthority("ADMIN")
                .antMatchers(HttpMethod.GET, "/api/restaurants/assignmanager").hasAnyAuthority("ADMIN")
                .antMatchers(HttpMethod.POST, "/api/restaurants").hasAnyAuthority("ADMIN")
                .antMatchers(HttpMethod.PUT, "/api/restaurants/**").hasAuthority("ADMIN")
                .antMatchers(HttpMethod.DELETE, "/api/restaurants/**").hasAuthority("ADMIN")

                // Order access
                .antMatchers(HttpMethod.POST, "/api/orders").hasAuthority("CUSTOMER")
                .antMatchers(HttpMethod.GET, "/api/orders").hasAuthority("ADMIN")  // updated by gorkha
                .antMatchers(HttpMethod.GET, "/api/orders/**").hasAnyAuthority("CUSTOMER", "MANAGER", "ADMIN")
                .antMatchers(HttpMethod.PUT, "/api/orders/**").hasAnyAuthority("MANAGER", "CUSTOMER")
                .antMatchers(HttpMethod.GET, "/api/orders/userId/*").hasAnyAuthority("CUSTOMER")
                .antMatchers(HttpMethod.GET, "/api/auth/userDetails/**").hasAnyAuthority("MANAGER", "ADMIN", "CUSTOMER")

                // MenuItem access
                .antMatchers(HttpMethod.GET, "/api/menu-items/**").hasAnyAuthority("CUSTOMER", "MANAGER")
                .antMatchers(HttpMethod.POST, "/api/menu-items").hasAnyAuthority("CUSTOMER", "MANAGER")
                .antMatchers(HttpMethod.PUT, "/api/menu-items/**").hasAuthority("MANAGER")
                .antMatchers(HttpMethod.DELETE, "/api/menu-items/**").hasAuthority("CUSTOMER")

                // customer feed back
                .antMatchers(HttpMethod.GET, "/api/feedback/menu/*").hasAnyAuthority("CUSTOMER", "ADMIN", "MANAGER")
                .antMatchers(HttpMethod.GET, "/api/feedback").hasAnyAuthority("CUSTOMER", "ADMIN", "MANAGER")
                .antMatchers(HttpMethod.POST, "/api/feedback").hasAnyAuthority("CUSTOMER", "ADMIN")
                .antMatchers(HttpMethod.PUT, "/api/feedback/*/reply").hasAuthority("ADMIN")

                // Email
                .antMatchers(HttpMethod.POST, "/api/send-email").hasAnyAuthority("ADMIN")

                .anyRequest().authenticated()
                .and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
}