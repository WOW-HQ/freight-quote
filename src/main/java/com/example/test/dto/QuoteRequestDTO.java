package com.example.test.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class QuoteRequestDTO {

    @NotNull(message = "长度不能为空")
    @DecimalMin(value = "0.001", message = "长度必须大于0")
    private BigDecimal length;

    @NotNull(message = "宽度不能为空")
    @DecimalMin(value = "0.001", message = "宽度必须大于0")
    private BigDecimal width;

    @NotNull(message = "高度不能为空")
    @DecimalMin(value = "0.001", message = "高度必须大于0")
    private BigDecimal height;

    @NotNull(message = "数量不能为空")
    @Min(value = 1, message = "数量至少为1")
    private Integer quantity;

    @NotNull(message = "重量不能为空")
    @DecimalMin(value = "0.01", message = "重量必须大于0")
    private BigDecimal weight;

    @NotNull(message = "请选择品名")
    private Long productId;
}
