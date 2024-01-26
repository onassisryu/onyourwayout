package com.ssafy.oywo.jwt;

import com.ssafy.oywo.dto.JwtToken;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

@Slf4j
@Component
public class JwtTokenProvider {

    private final Key key;

    public JwtTokenProvider(@Value("${jwt.secret}")String secretKey){
        byte[] keyBytes= Decoders.BASE64.decode(secretKey);
        this.key= Keys.hmacShaKeyFor(keyBytes);
    }

    public JwtToken generateToken(Authentication authentication){
        // 권한 가져오기
        String authorities=authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        long now=(new Date()).getTime();

        // Access Token 생성
        Date accessTokenExpiresIn=new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10);   // 1시간
        String accessToken= Jwts.builder()
                .setSubject(authentication.getName())
                .claim("auth",authorities)
                .setExpiration(accessTokenExpiresIn)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        // Refresh Token 생성
        Date refreshTokenExpiresIn=new Date(System.currentTimeMillis()+1000*60*60*10*24*30);    // 1달
        String refreshToken=Jwts.builder()
                .setSubject(authentication.getName())
                .claim("auth",authorities)
                .setExpiration(new Date(now+1000*60*30*30))
                .signWith(key,SignatureAlgorithm.HS256)
                .compact();

        return JwtToken.builder()
                .grantType("Bearer")
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    // Jwt 토큰을 복호화하여 토큰에 들어있는 정보를 꺼내는 메서드
    public Authentication getAuthentication(String accessToken){

        // Jwt 토큰 복호화
        Claims claims=parseClaims(accessToken);

        if(claims.get("auth")==null){
            throw new RuntimeException("권한 정보가 없는 토큰입니다.");
        }

        // 클레임에서 권한 정보 가져오기
        Collection<? extends GrantedAuthority> authorities=
                Arrays.stream(claims.get("auth").toString().split(","))
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());

        // UserDetails 객체를 만들어서 Authentication return
        UserDetails principal=new User(claims.getSubject(),"",authorities);
        return new UsernamePasswordAuthenticationToken(principal,"",authorities);
    }

    // 토큰 정보를 검증하는 메서드
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (SecurityException | MalformedJwtException e) {
            log.info("Invalid JWT Token", e);
        } catch (ExpiredJwtException e) {
            log.info("Expired JWT Token", e);
        } catch (UnsupportedJwtException e) {
            log.info("Unsupported JWT Token", e);
        } catch (IllegalArgumentException e) {
            log.info("JWT claims string is empty.", e);
        }
        return false;
    }

    // accessToken
    private Claims parseClaims(String accessToken) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(accessToken)
                    .getBody();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }

    // refreshToken 유효성 검증
    public String validateRefreshToken(String refreshToken){
        try{
            // 검증
            Jws<Claims> claims=Jwts.parser().setSigningKey(key).parseClaimsJws(refreshToken);

            // refreshToken의 만료시간이 지나지 않았을 경우, 새로운 accessToken을 발급
            if(!claims.getBody().getExpiration().before(new Date())){
                return recreationAccessToken(claims.getBody().get("sub").toString(),claims.getBody().get("auth"));
            }
        }catch (Exception e){
            // refreshToken이 만료되었을 경우, 로그인이 필요
            return null;
        }
        return null;

    }

    // 유효성 검증을 통과하게 되면 새로운 accessToken을 생성하고 반환하는 메소드
    public String recreationAccessToken(String userName, Object roles){

        Claims claims=Jwts.claims().setSubject(userName);
        claims.put("auth",roles);
        Date now=new Date();
        // Access Token
        String accessToken=Jwts.builder()
                .setClaims(claims)  // 정보 저장
                .setExpiration(new Date(now.getTime()+1000*60*30*30))
                .signWith(SignatureAlgorithm.HS256,key)
                .compact();

        return accessToken;
    }
}
