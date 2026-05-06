package com.example.test.service;

import com.example.test.dto.UserCreateDTO;
import com.example.test.pojo.user.SysUser;


public interface TestService {

    SysUser createUser(UserCreateDTO dto);
}
