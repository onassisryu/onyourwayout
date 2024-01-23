package com.ssafy.oywo.controller;

import com.ssafy.oywo.service.DealService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class DealController {

    private final DealService dealService;
}
