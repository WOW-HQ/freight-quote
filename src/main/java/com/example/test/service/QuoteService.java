package com.example.test.service;

import com.example.test.dto.QuoteRequestDTO;
import com.example.test.dto.QuoteResponseDTO;
import com.example.test.entity.Product;

import java.util.List;

public interface QuoteService {

    QuoteResponseDTO calculate(QuoteRequestDTO dto);

    List<Product> listProducts();
}
