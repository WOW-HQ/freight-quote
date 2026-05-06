package com.example.test.control;

import com.example.test.common.R;
import com.example.test.dto.UserCreateDTO;
import com.example.test.pojo.user.SysUser;
import com.example.test.service.TestService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/test")
public class TestControl {

    final TestService service;

    public TestControl(TestService service) {
        this.service = service;
    }

    @PostMapping("addUser")
    public R<SysUser> addUser(@Valid @RequestBody UserCreateDTO dto) {
        SysUser user = service.createUser(dto);
        return R.ok(user);
    }

    @DeleteMapping("delUser")
    public R<String> addUser(@Valid  Long userId) {
        return R.ok("ok");
    }

}
