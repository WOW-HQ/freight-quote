package com.example.test.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.example.test.dto.QuoteRequestDTO;
import com.example.test.dto.QuoteResponseDTO;
import com.example.test.entity.PriceRule;
import com.example.test.entity.Product;
import com.example.test.mapper.PriceRuleMapper;
import com.example.test.mapper.ProductMapper;
import com.example.test.service.QuoteService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class QuoteServiceImpl implements QuoteService {

    private final ProductMapper productMapper;
    private final PriceRuleMapper priceRuleMapper;

    public QuoteServiceImpl(ProductMapper productMapper, PriceRuleMapper priceRuleMapper) {
        this.productMapper = productMapper;
        this.priceRuleMapper = priceRuleMapper;
    }

    @Override
    @Transactional(rollbackFor = Exception.class, readOnly = true)
    public QuoteResponseDTO calculate(QuoteRequestDTO dto) {
        Product product = productMapper.selectById(dto.getProductId());
        if (product == null) {
            throw new IllegalArgumentException("品名不存在");
        }

        BigDecimal volume = dto.getLength()
                .multiply(dto.getWidth())
                .multiply(dto.getHeight())
                .setScale(6, RoundingMode.HALF_UP);

        if (volume.compareTo(BigDecimal.ZERO) == 0) {
            throw new IllegalArgumentException("体积不能为零");
        }

        BigDecimal density = dto.getWeight()
                .divide(volume, 4, RoundingMode.HALF_UP);

        PriceRule rule = priceRuleMapper.selectOne(
                new LambdaQueryWrapper<PriceRule>()
                        .eq(PriceRule::getProductId, dto.getProductId())
                        .le(PriceRule::getMinDensity, density)
                        .gt(PriceRule::getMaxDensity, density)
                        .orderByAsc(PriceRule::getMinDensity)
                        .last("LIMIT 1")
        );

        if (rule == null) {
            throw new IllegalArgumentException("未找到匹配的密度区间，请检查品名或货物密度");
        }

        BigDecimal totalPrice = rule.getUnitPrice()
                .multiply(dto.getWeight())
                .multiply(BigDecimal.valueOf(dto.getQuantity()))
                .setScale(2, RoundingMode.HALF_UP);

        return QuoteResponseDTO.builder()
                .volume(volume.setScale(4, RoundingMode.HALF_UP))
                .density(density.setScale(2, RoundingMode.HALF_UP))
                .unitPrice(rule.getUnitPrice())
                .totalPrice(totalPrice)
                .productName(product.getName())
                .productNameRu(product.getNameRu())
                .productNameEn(product.getNameEn())
                .build();
    }

    @Override
    public List<Product> listProducts() {
        return productMapper.selectList(null);
    }
}
