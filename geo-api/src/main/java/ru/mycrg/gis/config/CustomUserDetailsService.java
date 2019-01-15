package ru.mycrg.gis.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.User.UserBuilder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.gis.entity.Authorities;
import ru.mycrg.gis.entity.User;
import ru.mycrg.gis.repository.UserRepository;

import java.util.HashSet;

import static org.springframework.security.core.userdetails.User.withUsername;

@Service("userDetailsService")
public class CustomUserDetailsService implements UserDetailsService {

    private static Logger log = LoggerFactory.getLogger(CustomUserDetailsService.class);

    private final UserRepository userRepository;

    private static final String DEFAULT_ADMIN_NAME = "admin";
    private static final String DEFAULT_ADMIN_PASS = "geoserver";
    private static final String DEFAULT_ADMIN_ROLE = "ADMIN";

    @Autowired
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;

        userRepository.findUserByUsername(DEFAULT_ADMIN_NAME)
                .ifPresentOrElse(user -> {
                    log.info("SuperUser already exist");
                }, () -> {
                    User superUser = new User();
                    superUser.setUsername(DEFAULT_ADMIN_NAME);
                    superUser.setPassword(new BCryptPasswordEncoder().encode(DEFAULT_ADMIN_PASS));

                    HashSet<Authorities> authorities = new HashSet<>();
                    authorities.add(new Authorities(DEFAULT_ADMIN_ROLE, superUser));

                    superUser.setAuthorities(authorities);
                    userRepository.save(superUser);
                });
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var ref = new Object() {
            UserBuilder builder;
        };

        userRepository
                .findUserByUsername(username)
                .ifPresentOrElse(user -> {
                    ref.builder = withUsername(username);
                    ref.builder.disabled(!user.isEnabled());
                    ref.builder.password(user.getPassword());
                    String[] authorities = user.getAuthorities()
                            .stream().map(Authorities::getAuthority).toArray(String[]::new);

                    ref.builder.authorities(authorities);
                }, () -> {
                    throw new UsernameNotFoundException("User " + username + " not found.");
                });

        return ref.builder.build();
    }
}
