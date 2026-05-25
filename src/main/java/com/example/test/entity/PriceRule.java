package com.example.test.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("price_rule")
public class PriceRule {
    @TableId(type = IdType.AUTO)
    private Long id;

    private Long productId;

    private BigDecimal minDensity;

    private BigDecimal maxDensity;

    private BigDecimal unitPrice;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    @TableLogic
    @TableField(select = false)
    private Integer deleted;
}
