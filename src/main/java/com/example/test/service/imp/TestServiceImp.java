package com.example.test.service.imp;

import com.example.test.dto.UserCreateDTO;
import com.example.test.mapper.UserMapper;
import com.example.test.pojo.user.SysUser;
import com.example.test.service.TestService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TestServiceImp implements TestService {

    private static final BCryptPasswordEncoder PASSWORD_ENCODER = new BCryptPasswordEncoder();

    final UserMapper userMapper;

    public TestServiceImp(UserMapper userMapper) {
        this.userMapper = userMapper;
    }


    @Override
    @Transactional(rollbackFor = Exception.class)
    public SysUser createUser(UserCreateDTO dto) {
        SysUser user = new SysUser();
        user.setUsername(dto.getUsername());
        user.setPassword(PASSWORD_ENCODER.encode(dto.getPassword()));
        user.setNickname(dto.getNickname());
        user.setPhone(dto.getPhone());
        user.setEmail(dto.getEmail());
        user.setGender(dto.getGender());
        user.setAvatar(dto.getAvatar());
        user.setStatus(1L);

        userMapper.insert(user);
        return user;
    }
}
