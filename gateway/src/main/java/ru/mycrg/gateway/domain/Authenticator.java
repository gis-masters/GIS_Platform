package ru.mycrg.gateway.domain;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import ru.mycrg.oauth_client.JwtToken;

import java.util.List;
import java.util.stream.Collectors;

@Log4j2
public class Authenticator {

    public static boolean authenticate(JwtToken tokenModel, String secret) {
        // 1. Validate the token
        Claims claims = Jwts.parser()
                .setSigningKey(secret.getBytes())
                .parseClaimsJws(tokenModel.getAccess_token())
                .getBody();

        log.debug("Claims: {}", claims);

        String username = claims.get("user_name").toString();
        if (username != null) {
            @SuppressWarnings("unchecked")
            List<String> authorities = (List<String>) claims.get("authorities");

            // 2. Create auth object
            // UsernamePasswordAuthenticationToken: A built-in object, used by spring to represent the current authenticated / being authenticated user.
            // It needs a list of authorities, which has type of GrantedAuthority interface, where SimpleGrantedAuthority is an implementation of that interface
            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                    username, null, authorities.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList()));

            // 3. Authenticate the user. Now, user is authenticated
            SecurityContextHolder.getContext().setAuthentication(auth);

            return true;
        } else {
            log.warn("Incorrect claims, username not exist");

            return false;
        }
    }

}
