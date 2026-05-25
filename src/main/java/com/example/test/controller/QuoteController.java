package com.example.test.controller;

import com.example.test.common.R;
import com.example.test.dto.QuoteRequestDTO;
import com.example.test.dto.QuoteResponseDTO;
import com.example.test.entity.Product;
import com.example.test.service.QuoteService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quote")
public class QuoteController {

    private final QuoteService quoteService;

    public QuoteController(QuoteService quoteService) {
        this.quoteService = quoteService;
    }

    @PostMapping("/calculate")
    public R<QuoteResponseDTO> calculate(@Valid @RequestBody QuoteRequestDTO dto) {
        QuoteResponseDTO result = quoteService.calculate(dto);
        return R.ok(result);
    }

    @GetMapping("/products")
    public R<List<Product>> listProducts() {
        List<Product> products = quoteService.listProducts();
        return R.ok(products);
    }
}
