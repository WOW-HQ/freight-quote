package com.example.test.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuoteResponseDTO {

    private BigDecimal volume;
    private BigDecimal density;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;
    private String productName;
    private String productNameRu;
    private String productNameEn;
}
